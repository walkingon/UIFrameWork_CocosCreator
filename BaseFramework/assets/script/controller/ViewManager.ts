import { ResManager } from "./ResManager";
import { ViewBase } from "../view/base/ViewBase";
import { UIDepth } from "../abc/UIDepth";
import TouchBlock from "../view/common/TouchBlock";
import { ScreenAdapter } from "../tools/ScreenAdapter";

/**打开界面参数 */
export interface OpenViewOptions{
    /**要打开的界面class */
    View:any,
    /**自定义传给界面的参数 */
    CustomData?:any,
    /**打开完成回调 */
    FinishedCbk?:Function,
    /**播放动画 */
    PlayAnim?:boolean,
    /**加载进度回调 */
    ProcessCbk?:Function
}

/**关闭界面参数 */
export interface CloseViewOptions{
    /**要关闭的界面class */
    View:any,
    /**播放动画 */
    PlayAnim?:boolean
}

/**
 * 界面管理
 */
 export class ViewManager extends cc.Component{
     private static instance:ViewManager = null

     public static getInstance(){
         if(ViewManager.instance == null){
             let node = new cc.Node('ViewManager')
             cc.game.addPersistRootNode(node)
             ViewManager.instance = node.addComponent(ViewManager)
             ViewManager.instance.init()
         }
         return ViewManager.instance
     }

     /**已打开的界面列表 */
     private viewList:Array<ViewBase> = null

     /**View界面根节点 */
     private uiRoot:cc.Node = null

     /**tip根节点 */
     private tipRoot:cc.Node = null

     /**屏蔽界面点击层节点 */
     private touchBlockNode:cc.Node = null

     testBannerState:boolean = null

     private init(){
        this.viewList = []
        this.uiRoot = cc.find('Canvas/UIRoot')
        this.uiRoot.zIndex = UIDepth.UIRoot
        this.tipRoot = cc.find('Canvas/TipRoot')
        this.tipRoot.zIndex = UIDepth.TipRoot

        this.initTouchBlockView()
     }

     /**
      * 初始化屏蔽点击
      */
     private initTouchBlockView(){
        let self = this
        ResManager.getInstance().loadRes('prefab/common/TouchBlock', cc.Prefab, function(err, res){
            let node:cc.Node = cc.instantiate(res)
            node.parent = cc.find('Canvas')
            node.setPosition(cc.Vec2.ZERO)
            node.zIndex = UIDepth.TouchBlock
            node.active = false
            self.touchBlockNode = node
        })
     }

     /**
      * 关闭屏幕点击
      * @param showLoading 是否显示loading动画
      * @param tip 提示内容
      */
     public turnOffScreenClick(showLoading:boolean = false, tip:string = ''){
        if(this.touchBlockNode == null){
            return
        }
        this.touchBlockNode.active = true
        this.touchBlockNode.getComponent(TouchBlock).showLoading(showLoading)
        this.touchBlockNode.getComponent(TouchBlock).showDesc(tip)
     }

     /**开启屏幕点击 */
     public turnOnScreenClick(){
        if(this.touchBlockNode == null){
            return
        }
        this.touchBlockNode.active = false
     }

     /**
      * 刷新关闭屏幕点击时loading提示内容
      * @param tip 
      */
     public refreshTurnOffScreenClickTip(tip:string){
        if(this.touchBlockNode == null){
            return
        }
        this.touchBlockNode.getComponent(TouchBlock).showDesc(tip)
     }

     /**打开界面 */
     public openView(options:OpenViewOptions){
        let self = this

        this.turnOffScreenClick(true)

        ResManager.getInstance().loadRes(options.View.prafabPath, cc.Prefab, function(err, res){
            let node:cc.Node = cc.instantiate(res)
            let view = node.getComponent(options.View) as ViewBase

            /**历史界面暂停，如果打开的界面是全屏，历史界面进入后台 */
            for(let oldView of self.viewList){
                if(!oldView.isPaused){
                    oldView.pause()
                    cc.log(oldView.name + ' onPause');
                }
                if(view.isFullScreen){
                    if(!oldView.isHide){
                        oldView.hide()
                        cc.log(oldView.name + ' onHide');
                    }
                }
            }

            node.parent = self.uiRoot
            node.setPosition(cc.Vec2.ZERO)
            if(!view.isFullScreen){
                if(options.PlayAnim == false){
                    view.showBlackBg(true)
                }else{
                    view.playOpenAnim(()=>{
                        view.showBlackBg(true)
                    })
                }
            }else{
                view.showBlackBg(false)
            }
            view.onOpen(options.CustomData)
            cc.log(view.name + ' onOpen');
            
            
            self.turnOnScreenClick()

            view.instanceId = self.viewList.length + 1
            self.viewList.push(view)

            if(options.FinishedCbk){
                options.FinishedCbk()
            }
        })
     }

     /**关闭界面 */
     public closeView(options:CloseViewOptions){
         /**移除要关闭的界面 */
        for(let i = this.viewList.length - 1; i >= 0; i--){
            let mView = this.viewList[i]
            if(mView instanceof options.View){
                if(mView.isFullScreen || options.PlayAnim == false){
                    cc.log(mView.name + ' onClose');
                    mView.close()
                    //ResManager.getInstance().releaseRes(options.View.prafabPath)
                }else{
                    mView.showBlackBg(false)
                    mView.playCloseAnim(function(){
                        cc.log(mView.name + ' onClose');
                        mView.close()
                        //ResManager.getInstance().releaseRes(options.View.prafabPath)
                    })
                }
                this.viewList.splice(i, 1)
                break
            }
        }

        /**前一个界面继续 */
        for(let i = this.viewList.length - 1; i >= 0; i--){
            let mView = this.viewList[i]
            if(mView.isPaused){
                mView.resume()
                cc.log(mView.name + ' onResume');
                break
            }
        }

        /**往前查第一个全屏界面之上的历史界面回到前台 */
        for(let i = this.viewList.length - 1; i >= 0; i--){
            let mView = this.viewList[i]
            if(mView.isHide){
                mView.show()
                cc.log(mView.name + ' onShow');
            }
            if(mView.isFullScreen){
                break
            }
        }
     }

     /**
      * 向界面发送消息
      * @param view 目标界面class
      * @param msg 发送的内容
      * @returns 是否发送成功(界面是否存在)
      */
     public sendViewMessage(view:any, msg:any){
        for(let mview of this.viewList){
            if(mview instanceof view){
                mview.onReceiveMessage(msg)
                return true
            }
        }
        return false
     }

     /**
      * 获取已打开的界面
      * @param view 
      */
     public getView(view:any){
        for(let mview of this.viewList){
            if(mview instanceof view){
                return mview
            }
        }
        return null
     }

     /**
      * 提示
      * @param str 提示内容
      * @param disappear 消失时间s
      * @param normalColor 是否常规颜色
      */
     public showTip(str:string, disappear:number = 2, normalColor:boolean = true){
         let oldTipNodes = this.tipRoot.children
         for(let node of oldTipNodes){
             node.setPosition(node.position.x, node.position.y + 100)
        }
        let self = this
        ResManager.getInstance().loadRes('prefab/common/Tip', cc.Prefab, (err, res)=>{
            if(err){
                cc.log(err);
                return
            }
            let node = cc.instantiate(res) as cc.Node
            if(normalColor){
                node.getChildByName('rlb').getComponent(cc.RichText).string = '<color=#F70000>' + str + '</color>'
            }else{
                node.getChildByName('rlb').getComponent(cc.RichText).string = str
            }
            node.parent = self.tipRoot
            node.setPosition(cc.Vec2.ZERO)
            node.setScale(0.2)
            let seq = cc.sequence(cc.scaleTo(0.3, 1, 1).easing(cc.easeBackOut()), 
                cc.delayTime(disappear), cc.fadeOut(0.3), cc.callFunc(()=>{
                node.destroy()
                ResManager.getInstance().releaseRes('prefab/common/Tip')
            }))
            node.runAction(seq)
        })
     }
 }
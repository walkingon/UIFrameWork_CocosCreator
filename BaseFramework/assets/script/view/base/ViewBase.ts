import { ResManager } from "../../controller/ResManager";

/**界面基类 */
export abstract class ViewBase extends cc.Component{

    /////////////////////////////子类可用接口start////////////////////////////

    /**prefab资源相对于resources文件夹的路径 */
    public static prafabPath:string = ''

    /**是否是全屏界面
     * 全屏：遮挡整个屏幕的界面
     * 非全屏：如弹框。打开时会自动添加黑背景，自动播放打开和关闭动画
     */
    isFullScreen:boolean = false

    /**当界面打开 */
    abstract onOpen(customData:any);

    /**当界面关闭 */
    onClose(){}

    /**当界面进入后台（被上层全屏界面完全遮挡） */
    onHide(){}

    /**当界面返回前台 */
    onShow(){}

    /**当界面暂停（被上层界面部分或完全遮挡） */
    onPause(){}

    /**当界面继续 */
    onResume(){}

    /**当界面收到消息 */
    onReceiveMessage(msg:any){}

    /////////////////////////////子类接口end////////////////////////////


    /**是否在后台 */
    isHide:boolean = false

    /**是否已暂停 */
    isPaused:boolean = false

    /**界面实例id */
    instanceId:number = 0

    /**黑背景 */
    blackBg:cc.Node = null

    /**关闭界面 */
    close(){
        this.onClose()
        this.node.destroy()
    }

    /**进入后台 */
    hide(){
        this.node.active = false
        this.isHide = true
        this.onHide()
    }

    /**返回前台 */
    show(){
        this.node.active = true
        this.isHide = false
        this.onShow()
    }

    /**暂停 */
    pause(){
        this.isPaused = true
        this.onPause()
    }

    /**继续 */
    resume(){
        this.isPaused = false
        this.onResume()
    }

    /**显示黑背景 */
    showBlackBg(show:boolean){
        if(show){
            if(this.blackBg == null){
                let self = this
                ResManager.getInstance().loadRes('prefab/common/BlackBg', cc.Prefab, (err, res)=>{
                    if(err){
                        cc.error(err);
                        return
                    }
                    let node = cc.instantiate(res) as cc.Node
                    self.node.addChild(node, -1)
                    self.blackBg = node
                    node.opacity = 0
                    node.runAction(cc.fadeTo(0.2, 200))
                })
            }else{
                this.blackBg.active = true
            }
        }else{
            if(this.blackBg != null){
                this.blackBg.active = false
            }
        }
    }

    /**播放打开动画 */
    playOpenAnim(cbk?:Function){
        this.node.setScale(0.2)
        if(cbk){
            let seq = cc.sequence(cc.scaleTo(0.3, 1, 1).easing(cc.easeBackOut()), cc.callFunc(cbk))
            this.node.runAction(seq)
        }else{
            this.node.runAction(cc.scaleTo(0.3, 1, 1).easing(cc.easeBackOut()))
        }
    }

    /**播放关闭动画 */
    playCloseAnim(cbk?:Function){
        if(cbk){
            let seq = cc.sequence(cc.scaleTo(0.3, 0, 0).easing(cc.easeBackIn()), cc.callFunc(cbk))
            this.node.runAction(seq)
        }else{
            this.node.runAction(cc.scaleTo(0.3, 0, 0).easing(cc.easeBackIn()))
        }
    }
}
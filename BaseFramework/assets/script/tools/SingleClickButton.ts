import { StringKeyMap } from "./StringKeyMap";


/**
 * 单点触摸按钮
 * 在含有Button组件的节点上挂上此组件
 * 所有挂此组件的按钮点击事件同一时间将互斥，解决多点触控按钮同时响应的问题
 * 暂不适用于单个按钮上已绑定多个点击事件
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class SingleClickButton extends cc.Component {
    
    /**全局存储SingleClickButton对象 */
    static singleClickButtons:StringKeyMap<SingleClickButton> = null

    mButton:cc.Button = null

    /**是否已点击 */
    isClicked:boolean = null

    /**按钮原来响应点击的目标 */
    oriTarget:cc.Node = null

    /**按钮原来响应点击的组件名称 */
    oriComponent:string = null

    /**按钮原来响应点击的回调函数 */
    oriHandler:string = null

    start(){
        this.isClicked = false
        
        this.mButton = this.node.getComponent(cc.Button)
        this.saveSingleButton()
        this.replaceEvent()
    }

    saveSingleButton(){
        if(SingleClickButton.singleClickButtons == null ){
            SingleClickButton.singleClickButtons = new StringKeyMap()
        }
        SingleClickButton.singleClickButtons.set(this.uuid, this)
    }

    /**替换Button原有点击事件 */
    replaceEvent(){
        if(this.mButton){
            for(let eventHandler of this.mButton.clickEvents){
                this.oriTarget = eventHandler.target
                this.oriComponent = eventHandler.component
                this.oriHandler = eventHandler.handler
                eventHandler.target = this.node
                eventHandler.component = 'SingleClickButton'
                eventHandler.handler = 'interceptCallback'
            }
        }
    }

    /**替换后的点击事件 */
    interceptCallback(event, customEventData){
        let self = this
        /**是否有其他按钮已点击 */
        let needReturn = false
        SingleClickButton.singleClickButtons.foreach((k, v)=>{
            if(k != self.uuid && v.isClicked){
                console.warn('已有其他按钮点击，拦截点击事件!');
                needReturn = true
                return
            }
        })
        if(needReturn){
            return
        }

        /**标记并在0.1秒后取消点击标记 */
        this.isClicked = true
        //this.logSingleBtnFlag()
        this.scheduleOnce(function(){
            self.isClicked = false
            //self.logSingleBtnFlag()
        }, 0.2)

        /**传递原来的点击事件 */
        for(let eventHandler of this.mButton.clickEvents){
            eventHandler.target = this.oriTarget
            eventHandler.component = this.oriComponent
            eventHandler.handler = this.oriHandler
        }
        cc.Component.EventHandler.emitEvents(this.mButton.clickEvents, event);
        this.node.emit('click', this.mButton);
        
        /**分发完重新注册拦截事件 */
        this.replaceEvent()
    }

    /**打印按钮点击标记 */
    logSingleBtnFlag(){
        SingleClickButton.singleClickButtons.foreach((k, v)=>{
            console.log(k + ' isClicked:' + v.isClicked);
        })
    }

    onDisable(){
        this.isClicked = false
    }

    onDestroy(){
        SingleClickButton.singleClickButtons.remove(this.uuid)
    }
}

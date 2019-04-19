/**渐隐渐现呼吸效果 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class FadeBreath extends cc.Component {

    /**呼吸间隔，s */
    gapTime:number = 0.5

    onEnable(){
        let seq = cc.sequence(cc.fadeOut(this.gapTime/2), cc.fadeIn(this.gapTime), cc.delayTime(this.gapTime/2))
        this.node.runAction(cc.repeatForever(seq))
    }

    onDisable(){
        this.node.stopAllActions()
    }
}

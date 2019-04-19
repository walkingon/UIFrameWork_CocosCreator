/**震屏 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShakeEffect extends cc.Component {
    
    /**
     * 震屏效果
     * @param duration 震屏时间
     */
    shakeEffect(duration:number) {
        this.node.runAction(
            cc.repeatForever(
                cc.sequence(
                    cc.moveTo(0.02, new cc.Vec2(5, 7)),
                    cc.moveTo(0.02, new cc.Vec2(-6, 7)),
                    cc.moveTo(0.02, new cc.Vec2(-13, 3)),
                    cc.moveTo(0.02, new cc.Vec2(3, -6)),
                    cc.moveTo(0.02, new cc.Vec2(-5, 5)),
                    cc.moveTo(0.02, new cc.Vec2(2, -8)),
                    cc.moveTo(0.02, new cc.Vec2(-8, -10)),
                    cc.moveTo(0.02, new cc.Vec2(3, 10)),
                    cc.moveTo(0.02, new cc.Vec2(0, 0))
                )
            )
        );

        setTimeout(() => {
            if(this.node){
                this.node.stopAllActions();
                this.node.setPosition(0,0);
            }
        }, duration*1000);
    }
}

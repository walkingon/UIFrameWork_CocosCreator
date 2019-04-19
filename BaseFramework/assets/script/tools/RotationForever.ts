
const {ccclass, property} = cc._decorator;

@ccclass
export default class RotationForever extends cc.Component {

    onEnable(){
        this.rotation()
    }

    onDisable(){
        this.node.stopAllActions()
    }

    private rotation(){
        let rot = cc.rotateBy(0.4, 180)
        this.node.runAction(cc.repeatForever(rot))
    }

}

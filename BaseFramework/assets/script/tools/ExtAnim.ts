import { ScreenAdapter } from "./ScreenAdapter";


/**页面左右展开与收起动画 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class ExtAnim extends cc.Component {
    @property([cc.Node])
    leftNodes:cc.Node[] = []

    @property([cc.Node])
    rightNodes:cc.Node[] = []

    /**左侧节点原始坐标 */
    leftOriPos:cc.Vec2[] = null

    /**右侧节点原始坐标 */
    rightOriPos:cc.Vec2[] = null

    /**屏幕宽度 */
    screenWidth:number = null

    start(){
        this.leftOriPos = []
        for(let node of this.leftNodes){
            this.leftOriPos.push(node.getPosition())
        }
        this.rightOriPos = []
        for(let node of this.rightNodes){
            this.rightOriPos.push(node.getPosition())
        }
    }

    getScreenWidth(){
        if(this.screenWidth == null){
            this.screenWidth = ScreenAdapter.getInstance().getDesignSize().width + ScreenAdapter.getInstance().getOffsetX()*2
        }
        return this.screenWidth
    }

    /**展开动画 */
    playExtAnim(cbk:Function){
        let duration:number = 0.5
        /**左侧 */
        for(let i = 0; i < this.leftNodes.length; i++){
            let node = this.leftNodes[i]
            node.runAction(cc.moveBy(duration, -this.getScreenWidth()/2, 0))
        }
        /**右侧 */
        for(let i = 0; i < this.rightNodes.length; i++){
            let node = this.rightNodes[i]
            if(i == this.rightNodes.length - 1){
                node.runAction(cc.sequence(cc.moveBy(duration, this.getScreenWidth()/2, 0), cc.callFunc(cbk)))
            }else{
                node.runAction(cc.moveBy(duration, this.getScreenWidth()/2, 0))
            }
        }
    }

    /**收起动画 */
    playPackUpAnim(cbk:Function){
        let duration:number = 0.5
        /**左侧 */
        for(let i = 0; i < this.leftNodes.length; i++){
            let node = this.leftNodes[i]
            let pos = null
            if(this.leftOriPos == null || this.leftOriPos.length == 0){
                pos = node.getPosition()
            }else{
                pos = this.leftOriPos[i]
            }
            node.setPosition(pos.x - this.getScreenWidth()/2, pos.y)
            node.runAction(cc.moveTo(duration, pos.x, pos.y))
        }
        /**右侧 */
        for(let i = 0; i < this.rightNodes.length; i++){
            let node = this.rightNodes[i]
            let pos = null
            if(this.rightOriPos == null || this.rightOriPos.length == 0){
                pos = node.getPosition()
            }else{
                pos = this.rightOriPos[i]
            }
            node.setPosition(pos.x + this.getScreenWidth()/2, pos.y)
            if(i == this.rightNodes.length - 1){
                node.runAction(cc.sequence(cc.moveTo(duration, pos.x, pos.y), cc.callFunc(cbk)))
            }else{
                node.runAction(cc.moveTo(duration, pos.x, pos.y))
            }
        }
    }
}

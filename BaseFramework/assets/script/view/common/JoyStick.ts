import { JoyStickPlayer } from "./JoyStickPlayer"

export enum JoyStickSpeedType {
    STOP = 'stop',
    NORMAL = 'normal',
    FAST = 'fast',
}
enum JoyStickType {
    FIXED = 'fixed',
    FOLLOW = 'follow',
}
enum DirectionType {
    FOUR = 'four',
    EIGHT = 'eight',
    ALL = 'all',
}

const { ccclass, property } = cc._decorator

/**摇杆控制器 */
@ccclass
export class JoyStick extends cc.Component {

    //摇杆背景
    @property(cc.Node)
    private bgNode: cc.Node = null

    //摇杆 dot
    @property(cc.Node)
    private dotNode: cc.Node = null

    @property
    private joyStickType: JoyStickType = JoyStickType.FIXED

    @property
    private directionType: DirectionType = DirectionType.ALL

    //摇杆位置
    private stickPos: cc.Vec2 = null
    //触摸位置
    private touchPos: cc.Node = null
    //bg 半径
    private radius: number

    private tmpP:cc.Vec2 = new cc.Vec2()

    /**被摇杆控制的角色 */
    public joyStickPlayer: JoyStickPlayer = null

    onLoad() {
        this.radius = this.bgNode.width / 2
    }

    start(){
        this.node.setContentSize(this.bgNode.getContentSize())

        if (this.joyStickType == JoyStickType.FOLLOW) {
            this.node.opacity = 0
        }
        this.initTouchEvent()
    }

    initTouchEvent() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStartEvent, this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMoveEvent, this)
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEndEvent, this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEndEvent, this)
    }

    touchStartEvent(event) {
        if (this.joyStickPlayer == null) {
            return
        }
        let startTouchPos = this.node.convertToNodeSpaceAR(event.getLocation())
        if (this.joyStickType == JoyStickType.FIXED) {
            this.stickPos = this.bgNode.getPosition()
            let distance = startTouchPos.sub(this.bgNode.getPosition()).mag()
            if (this.radius > distance) {
                this.dotNode.setPosition(startTouchPos)
            }
        }
        else if (this.joyStickType == JoyStickType.FOLLOW) {
            this.stickPos = startTouchPos
            this.node.opacity = 255
            this.touchPos = event.getLocation()
            this.bgNode.setPosition(startTouchPos)
            this.dotNode.setPosition(startTouchPos)
        }
    }

    touchMoveEvent(event) {
        if (this.joyStickPlayer == null) {
            return
        }
        if (this.joyStickType == JoyStickType.FOLLOW) {
            if (this.touchPos == event.getLocation()) {
                return
            }
        }

        //将触摸坐标 转化到 bg 下， 此时 的dis 就是 触摸点相对于bg 的距离
        let touchP = this.bgNode.convertToNodeSpaceAR(event.getLocation())
        let dis = touchP.mag()

        let posX = this.stickPos.x + touchP.x
        let posY = this.stickPos.y + touchP.y

        //向量归一(获取方向)
        cc.v2(posX, posY).sub(this.bgNode.getPosition(), this.tmpP)
        this.tmpP.normalizeSelf()

        if (this.radius > dis) {
            this.dotNode.setPosition(cc.v2(posX, posY))
            this.joyStickPlayer.speedType = JoyStickSpeedType.NORMAL
        }
        else {
            //摇杆在圈边
            let nowPosX = this.stickPos.x + this.tmpP.x * this.radius
            let nowPosy = this.stickPos.y + this.tmpP.y * this.radius
            this.dotNode.setPosition(cc.v2(nowPosX, nowPosy))
            this.joyStickPlayer.speedType = JoyStickSpeedType.FAST
        }

        if(this.directionType == DirectionType.ALL){
            this.joyStickPlayer.moveDir.x = this.tmpP.x
            this.joyStickPlayer.moveDir.y = this.tmpP.y
        }else if(this.directionType == DirectionType.FOUR){
            if(Math.abs(this.tmpP.x) > Math.abs(this.tmpP.y)){
                this.joyStickPlayer.moveDir.x = this.tmpP.x
                this.joyStickPlayer.moveDir.y = 0
            }else{
                this.joyStickPlayer.moveDir.x = 0
                this.joyStickPlayer.moveDir.y = this.tmpP.y
            }
        }else if(this.directionType == DirectionType.EIGHT){

        }
    }

    touchEndEvent(event) {
        if (this.joyStickPlayer == null) {
            return
        }
        this.dotNode.setPosition(this.bgNode.getPosition())
        if (this.joyStickType == JoyStickType.FOLLOW) {
            this.node.opacity = 0
        }
        this.joyStickPlayer.speedType = JoyStickSpeedType.STOP
    }


    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchStartEvent, this)
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchMoveEvent, this)
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEndEvent, this)
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEndEvent, this)
    }

}

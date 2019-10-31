import { JoyStickSpeedType } from "./JoyStick"

const { ccclass, property } = cc._decorator

/**摇杆控制的角色 */
@ccclass
export class JoyStickPlayer extends cc.Component {

    /**移速类型。JoyStick维护此变量，不要手动修改 */
    public speedType: JoyStickSpeedType = JoyStickSpeedType.STOP
    /**移动方向。JoyStick维护此变量，不要手动修改 */
    public moveDir: cc.Vec2 = new cc.Vec2()

    private initCompleted: boolean = false
    private moveSpeed: number = null
    private normalSpeed: number = null
    private fastSpeed: number = null

    /**障碍物瓦片地图，角色不可通过 */
    private blockTiledMapLayer:cc.TiledLayer = null
    /**转换cocos坐标为地图格子索引的方法 */
    private convertToTileIndexFunction = null

    private needRotation:boolean = false

    private tmpPos: cc.Vec2 = new cc.Vec2()

    /**
     * 初始化角色移动属性
     * @param needRotation 是否受摇杆控制旋转
     * @param normalSpeed 常规移速
     * @param fastSpeed 快速移速
     * @param blockMapLayer 障碍物瓦片地图，角色不可通过
     * @param convertToTileIndexFunction 转换cocos坐标为地图格子索引的方法
     */
    public init(needRotation:boolean, normalSpeed: number, fastSpeed: number = null, 
        blockMapLayer:cc.TiledLayer = null, convertToTileIndexFunction = null) {
        this.needRotation = needRotation
        this.normalSpeed = normalSpeed
        if (fastSpeed == null) {
            this.fastSpeed = normalSpeed
        } else {
            this.fastSpeed = fastSpeed
        }
        this.blockTiledMapLayer = blockMapLayer
        this.convertToTileIndexFunction = convertToTileIndexFunction
        this.initCompleted = true
    }

    update(dt) {
        if (!this.initCompleted) {
            return
        }
        switch (this.speedType) {
            case JoyStickSpeedType.STOP:
                return
            case JoyStickSpeedType.NORMAL:
                this.moveSpeed = this.normalSpeed
                break
            case JoyStickSpeedType.FAST:
                this.moveSpeed = this.fastSpeed
                break

        }
        this.move()
    }

    private move() {
        if(this.needRotation){
            this.node.rotation = 90 - cc.misc.radiansToDegrees(Math.atan2(this.moveDir.y, this.moveDir.x))
        }
        this.node.position.add(this.moveDir.mul(this.moveSpeed / 60), this.tmpPos)
        if(this.blockTiledMapLayer){
            let pos = this.convertToTileIndexFunction.call(null, this.tmpPos)
            let id = this.blockTiledMapLayer.getTileGIDAt(pos)
            if(id == 0){
                this.node.setPosition(this.tmpPos)
            }
        }else{
            this.node.setPosition(this.tmpPos)
        }
    }
}
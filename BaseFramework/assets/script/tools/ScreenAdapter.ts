
/**屏幕适配器 */

export class ScreenAdapter{

    private static instance:ScreenAdapter = null

    private screenSize:cc.Size = null
    private frameSize:cc.Size = null

    /**设计分辨率 */
    private designSize:cc.Size = new cc.Size(720, 1280)

    /**屏幕方向是否为纵向 */
    private isPortrait:boolean = true

    /**单边偏差. 若是横向拉伸则为x偏差，若纵向拉伸则指y偏差 */
    private offsetValue:number = 0

    /**拉伸方向上需要放大多少倍 */
    private ret:number = 1

    public static getInstance() {
        if(this.instance == null){
            this.instance = new ScreenAdapter()
            this.instance.init()
        }
        return this.instance
    }

    private init() {
        cc.log('ScreenAdapter.init()');
        this.frameSize = cc.view.getFrameSize()
        cc.log('frameSize', this.frameSize);
        this.screenSize = cc.view.getVisibleSizeInPixel()
        cc.log('screenSize', this.screenSize);
    }

    /**分辨率适配 */
    public screenFit(){
        let frameWidth = this.frameSize.width;
        let frameHeight = this.frameSize.height;
        /**设备宽高比 */
        let widthHeightRatio = frameWidth * 1.0 / frameHeight;
        /**设计宽高比 */
        let designRatio = this.designSize.width/this.designSize.height

        let fitWidth = true
        let fitHeight = true
        if (widthHeightRatio < designRatio) {
            fitWidth = true
            fitHeight = false
        }else if(widthHeightRatio == designRatio){
            fitWidth = true
            fitHeight = true
        } else {
            fitHeight = true
            fitWidth = false
        }
        let curScene = cc.director.getScene()
        let canvasComp = curScene.getChildByName('Canvas').getComponent(cc.Canvas)
        if (curScene && canvasComp) {
            canvasComp.fitHeight = fitHeight
            canvasComp.fitWidth = fitWidth
        }
        cc.log('fitWidth:' + fitWidth + ' fitHeight:' + fitHeight)
        
        if(this.isPortrait){
            let ret = this.screenSize.height/this.designSize.height
            ret = ret/(this.screenSize.width/this.designSize.width)
            this.ret = ret
            this.offsetValue = (this.designSize.height * ret - this.designSize.height)/2
        }else{
            let ret = this.screenSize.width/this.designSize.width
            ret = ret/(this.screenSize.height/this.designSize.height)
            this.ret = ret
            this.offsetValue = (this.designSize.width * ret - this.designSize.width)/2
        }
        cc.log('ret ' + this.ret)
        cc.log('offsetValue ' + this.offsetValue)
    }

    /**屏幕宽高比 */
    public getScreenRatio() {
        return this.frameSize.width * 1.0 / this.frameSize.height
    }

    /**设计宽高比 */
    public getDesignRatio(){
        return this.designSize.width * 1.0 / this.designSize.height
    }

    /**适配背景 */
    fitBg(bgNode:cc.Node){
        if(this.isPortrait){
            if(this.getScreenRatio() < this.getDesignRatio()){
                /**纵向拉伸背景 */
                bgNode.height = this.designSize.height * this.ret
            }
        }else{
            if(this.getScreenRatio() > this.getDesignRatio()){
                /**横向拉伸背景 */
                bgNode.width = this.designSize.width * this.ret
            }
        }
    }

    /**适配左侧元素,用于横版游戏 */
    fitLeft(leftNode:cc.Node){
        if(this.isPortrait){
            cc.error('不适用此方法');
            return
        }
        if(this.getScreenRatio() > this.getDesignRatio()){
            let newX = leftNode.position.x -= this.offsetValue
            leftNode.position.x -= this.offsetValue
            leftNode.setPosition(newX, leftNode.position.y)
        }
    }

    /**适配右侧元素,用于横版游戏 */
    fitRight(rightNode:cc.Node){
        if(this.isPortrait){
            cc.error('不适用此方法');
            return
        }
        if(this.getScreenRatio() > this.getDesignRatio()){
            rightNode.setPosition(rightNode.position.x += this.offsetValue, rightNode.position.y)
        }
    }

    /**适配顶部元素，用于竖版游戏 */
    fitTop(topNode:cc.Node){
        if(!this.isPortrait){
            cc.error('不适用此方法');
            return
        }
        if(this.getScreenRatio() < this.getDesignRatio()){
            let newY = topNode.position.y += this.offsetValue
            //刘海
            topNode.setPosition(topNode.x, newY)
        }
    }

    /**适配底部元素，用于竖版游戏 */
    fitBot(botNode:cc.Node){
        if(!this.isPortrait){
            cc.error('不适用此方法');
            return
        }
        if(this.getScreenRatio() < this.getDesignRatio()){
            let newY = botNode.position.y -= this.offsetValue
            botNode.setPosition(botNode.x, newY)
        }
    }

    /**获取设计分辨率 */
    getDesignSize(){
        return this.designSize
    }

    getRet(){
        return this.ret
    }

    getOffset(){
        return this.offsetValue
    }

    getScreenSize(){
        return this.screenSize
    }

    getFrameSize(){
        return this.frameSize
    }
}
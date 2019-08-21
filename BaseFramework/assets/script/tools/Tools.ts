
const POINT_EPSILON = parseFloat('1.192092896e-07F');

/**工具类 */
export class Tools{

    /**
     * 获取随机整数,包含min,包含max
     * @param min 
     * @param max 
     */
    static getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
    }

    /**
     * 获取随机浮点数,包含min,不含max
     * @param min 
     * @param max 
     */
    static getRandomArbitrary(min: number, max: number): number{
        return Math.random() * (max - min) + min
    }

    /**
     * 数值格式化，eg:10000 => 10k
     * @param num 
     */
    static numberFormat(num:number):string{
        let K = 1000
        let M = 1000000
        if(num >= 10*M){
            return Math.floor(num/M) + 'm'
        }else if(num >= 10*K){
            return Math.floor(num/K) + 'k'
        }else{
            return num.toString()
        }
    }

    /**
     * 是否是null或undefined
     * @param val 
     */
    static isNullOrUndefined(val):boolean{
        if(val == null || val == undefined){
            return true
        }
        return false
    }

    /**
     * 获取md5url
     * @param url 
     */
    static getMd5Url(url) {
        if (cc.loader.md5Pipe) {
            url = cc.loader.md5Pipe.transformURL(url);
        }
        return url;
    }

    /**
     * 获取真实url
     * @param resUrl 
     */
    static getRawUrl(resUrl) {
        var url = cc.url.raw(resUrl);
        return Tools.getMd5Url(url);
    }

    /**
     * 获取远程服务器url。微信端
     * @param resUrl 
     */
    static getRemoteRawUrl(resUrl) {
        cc.log(wxDownloader.REMOTE_SERVER_ROOT + '/' + Tools.getRawUrl(resUrl))
        return wxDownloader.REMOTE_SERVER_ROOT + '/' + Tools.getRawUrl(resUrl);
    }

    /**
     * 获取节点上的组件，若不存在则先添加
     * @param node 
     * @param comp 
     */
    static getOrAddComponent(node, comp) {
        if (node && comp) {
            var ret = node.getComponent(comp);
            if (!ret) {
                ret = node.addComponent(comp);
            }
            return ret;
        } else {
            return null;
        }
    }

    /**
     * 获取当前时间戳，单位毫秒
     * @returns  {number} 时间戳，单位毫秒
     */
    static getTimestampMS() {
        return Math.floor(Date.now());
    }

    /**
     * 获取当前时间戳，单位秒
     * @returns  {number} 时间戳，单位秒
     */
    static getTimestampS() {
        return Math.floor(Tools.getTimestampMS() / 1000);
    }

    /**
     * 拆分string为数值数组
     * @param  {string} str
     * @param  {string} char
     */
    static splitToNumList(str, char = ',') {
        const strs = str.split(char);
        const nums = [];
        for (var i = 0; i < strs.length; i++) {
            if (strs[i].length > 0) {
                nums.push(Number(strs[i]));
            }
        }
        return nums;
    }

    /**
     * 返回范围内的数值
     * @param  {number} min clamp的最小值
     * @param  {number} max clamp的最大值
     * @param  {number} n 实际值
     */
    static clamp(min, max, n) {
        return Math.max(min, Math.min(max, n))
    }

    /**判断点在屏幕外 */
    static isOutOfScreen(pos) {
        var size = cc.winSize;
        return Math.abs(pos.x) > size.width / 2 || Math.abs(pos.y) > size.height / 2;
    }

    /**
     * 比较版本字符串
     * @param  {string} a
     * @param  {string} b
     * @returns  {number} 1 if a > b; -1 if a < b; 0 if a == b
     */
    static compareVersionStr(a, b) {
        if (a === b) {
            return 0;
        }

        var a_components = a.split(".");
        var b_components = b.split(".");

        var len = Math.min(a_components.length, b_components.length);

        // loop while the components are equal
        for (var i = 0; i < len; i++) {
            // A bigger than B
            if (parseInt(a_components[i]) > parseInt(b_components[i])) {
                return 1;
            }

            // B bigger than A
            if (parseInt(a_components[i]) < parseInt(b_components[i])) {
                return -1;
            }
        }

        // If one's a prefix of the other, the longer one is greater.
        if (a_components.length > b_components.length) {
            return 1;
        }

        if (a_components.length < b_components.length) {
            return -1;
        }

        // Otherwise they are the same.
        return 0;
    }

    /**格式时间转时间戳ms, "2017-06-16 12:21:12"*/
    static getTimeNumber(timeStr:string){
        timeStr = timeStr.replace(/-/g, '/') //IOS系统不支持2017-01-01格式的时间 用正则替换2017-01-01日期格式为2017/01/01
        cc.log(timeStr)
        let timestamp2 = Date.parse(timeStr);
        cc.log(timestamp2)
        return timestamp2
    }

    /**
     * 获得两个时间戳之间相差的时间
     * @param startTime s
     * @param endTime s
     */
    static getTimeDiff(startTime, endTime) {
        const nTime = endTime - startTime
        let timeCount = {
            day : Math.floor(nTime / 86400),
            hour : Math.floor(nTime % 86400 / 3600),
            minute : Math.floor(nTime % 86400 % 3600 / 60),
            second : Math.floor(nTime % 86400 % 3600 % 60),
        };
        return timeCount;
    }

    /**
     * 时间戳ms转成时间格式
    */
   static timestampToTime(timestamp) {
        var date = new Date(timestamp);
        var Y = date.getFullYear() + '.';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';
        var D = (date.getDate() + 1 < 10 ? '0' + (date.getDate() + 1) : date.getDate() + 1)
        return Y + M + D;
    }

    /**
     * 数组是否包含某值
     * @param arr 
     * @param checkItem 
     */
    static arrContains(arr, checkItem) {
        for (const item of arr) {
            if (item === checkItem) {
                return true;
            }
        }
        return false;
    }

    /**
     * !#zh 返回两个向量之间带正负号的弧度。
     * @method pAngleSigned
     * @param {Vec2} a
     * @param {Vec2} b
     * @return {Number} the signed angle in radians between two vector directions
     */
    static pAngleSigned(a, b) {
        var a2 = a.normalize();
        var b2 = b.normalize();
        var angle = Math.atan2(a2.x * b2.y - a2.y * b2.x, a2.dot(b2));
        if (Math.abs(angle) < POINT_EPSILON)
            return 0.0;
        return angle;
    }

    /**
     * 获取节点pA相对于节点pB的父节点的坐标
     * @param pA 
     * @param pB 
     */
    static getRelationPos(pA:cc.Node, pB:cc.Node):cc.Vec2{
        let worldPos = pA.parent.convertToWorldSpaceAR(pA.getPosition())
        return pB.parent.convertToNodeSpaceAR(worldPos)
    }

    /** 正态分布概率密度函数*/
    static Normal(x:number, miu:number, sigma:number)                        
    {
        return 1.0/(Math.sqrt(2*3.14)*sigma) * Math.exp(-1*(x-miu)*(x-miu)/(2*sigma*sigma));
    }

    /** 
     * 产生正态分布随机数
     * @param miu 期望
     * @param sigma 离散程度
     * @param min 最小值
     * @param max 最大值
     */
    static Random_Normal( miu:number, sigma:number, min:number, max:number)    
    {
       let x:number = null
       let dScope:number = null
       let y:number = null

        do{
            x = Tools.getRandomArbitrary(min,max); 
            y = Tools.Normal(x, miu, sigma);
            dScope = Tools.getRandomArbitrary(0, Tools.Normal(miu,miu,sigma));
        }while( dScope > y);

        return x;
    }

    /**
     * 获取某个时间戳日期的某个时间点的时间戳
     * @param time 时间戳 s
     * @param str 时间点 如：12:00:00
     * @returns 时间戳 s
     */
    static getTimeByStr(time:number, str:string){
        time*=1000
        let numList = str.split(':')
        let date = new Date(time)
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        let D = date.getDate() + ' ';
        let h = numList[0] + ':';
        let m = numList[1] + ':';
        let s = numList[2]; 
        let zeroDateStr = Y+M+D+h+m+s + ':000'
        //javascript Date在ios上显示NAN
        zeroDateStr = zeroDateStr.replace(/-/g, '/')
        let zeroDate = new Date(zeroDateStr)
        return Math.floor(zeroDate.getTime()/1000) 
    }

    /**设置帧率 */
    static setFPS(fps:number){
        if(CC_WECHATGAME){
            wx.setPreferredFramesPerSecond(fps)
        }else{
            cc.game.setFrameRate(fps)
        }
    }
}
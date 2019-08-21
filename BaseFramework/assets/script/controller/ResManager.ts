import { StringKeyMap } from "../tools/StringKeyMap";

/**
 * 资源管理类
 */
export class ResManager{

    private static instance:ResManager = null
    public static getInstance(){
        if(ResManager.instance == null){
            ResManager.instance = new ResManager()
        }
        return ResManager.instance
    }

    /**已加载资源引用计数, key:资源路径 value:被加载次数 */
    private resLoadNumMap:StringKeyMap<number> = new StringKeyMap()

    /**
     * 加载资源
     * @param url 资源路径
     * @param resType 资源类型
     * @param completeCallback 完成回调，回传参数列表 (error, resource)
     * @param processCallback 进度回调，回传参数列表 (completedCount, totalCount, item)
     */
    loadRes(url:string, resType:typeof cc.Asset, completeCallback:Function = null, processCallback:Function = null) {
        cc.loader.loadRes(url, resType, (completedCount:number, totalCount:number, item:any)=>{
            //进度回调
            if(processCallback){
                processCallback(completedCount, totalCount, item)
            }
        }, (error, resource) => {
            //完成回调
            if (error) {
                cc.error('ResManager loadRes Error', error);
                return
            }
            if (completeCallback) {
                completeCallback(error, resource);
            }

            /**资源引用计数 */
            let deps = cc.loader.getDependsRecursively(url);
            for(let resPath of deps){
                let num = this.resLoadNumMap.get(resPath)
                if(num == null){
                    this.resLoadNumMap.set(resPath, 1)
                }else{
                    this.resLoadNumMap.set(resPath, num + 1)
                }
            }
            //cc.log('loaded.', this.resLoadNumMap.toArray())
        });
    }

    /**
     * 释放资源
     * @param url 
     */
     releaseRes(url:string){
        let deps = cc.loader.getDependsRecursively(url);
        for(let resPath of deps){
            let num = this.resLoadNumMap.get(resPath)
            if(num != null){
                num--
                this.resLoadNumMap.set(resPath, num)
                if(num <= 0){
                    cc.loader.release(resPath)
                    this.resLoadNumMap.remove(resPath)
                }
            }
        }
        //cc.log('released.', this.resLoadNumMap.toArray())
     }

    /**
     * 清理资源，微信平台清理小游戏缓存
     * @param  {function} callback
     */
    cleanAllAssets(callback) {
        cc.log('微信平台清理小游戏缓存');
        
        if (wx.getFileSystemManager) {
            var fs = wx.getFileSystemManager();
            if (fs.readdir) {
                this.cleanDir(fs, wx.env.USER_DATA_PATH + '/res', callback);
                return;
            }
        }

        if (callback) callback();
    }

    /**
     * wx平台，清除指定目录下的资源
     * @param  {object} fs FileSystemManager,wx文件管理器
     * @param  {string} dir 路径
     * @param  {function} callback 回调方法
     */
    cleanDir (fs, dir, callback) {
        if(CC_DEBUG){
            cc.log('cleanDir ' + dir);
        }
        
        fs.readdir({
            dirPath: dir,
            success: (res) => {
                const totalCount = res.files.length;
                if (totalCount > 0) {
                    let handledCount = 0;
                    for (const file of res.files) {
                        const path = dir + '/' + file;
                        fs.stat({
                            path: path,
                            success: (res) => {
                                if (res.stats.isFile()) {
                                    fs.unlink({
                                        filePath: path,
                                        success: !CC_DEBUG ? null : () => {
                                            cc.log('Removed local file ' + path + ' successfully!');
                                        },
                                        fail: !CC_DEBUG ? null : (res) => {
                                            cc.warn('Failed to remove file(' + path + '): ' + res ? res.errMsg : 'unknown error');
                                        },
                                        complete: () => {
                                            if (++handledCount >= totalCount && callback) callback();
                                        }
                                    });
                                } else if (res.stats.isDirectory()) {
                                    this.cleanDir(fs, path, () => {
                                        fs.unlink({
                                            filePath: path
                                        });
                                        if (++handledCount >= totalCount && callback) callback();
                                    });
                                }
                            },
                            fail: () => {
                                if (++handledCount >= totalCount && callback) callback();
                            }
                        });
                    }
                } else {
                    if (callback) callback();
                }
            },
            fail: () => {
                cc.warn('fail to readdir:' + dir);
                if (callback) callback();
            }
        });
    }

    /**微信退出 */
    restart () {
        cc.log('微信退出');
        wx.exitMiniProgram({
            complete: () => {
                cc.log('exit complete');
            }
        });
    }

    /**检查目录存在, wx平台 */
    ensureDirFor (path, callback) {
        // cc.log('mkdir:' + path);
        var ensureDir = cc.path.dirname(path);
        if (ensureDir === "wxfile://usr" || ensureDir === "http://usr") {
            callback();
            return;
        }
        wx.getFileSystemManager().access({
            path: ensureDir,
            success: callback,
            fail: function (res) {
                this.ensureDirFor(ensureDir, function () {
                    wx.getFileSystemManager().mkdir({
                        dirPath: ensureDir,
                        complete: callback,
                    });
                });
            },
        });
    }
}
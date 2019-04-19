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
     * @param url 
     * @param resType 
     * @param completeCallback 
     */
    loadRes(url, resType, completeCallback) {
        cc.loader.loadRes(url, resType, (error, resource) => {
            if (error) {
                console.warn('ResManager loadRes Error');
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
            //console.log('loaded.', this.resLoadNumMap.toArray())
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
        //console.log('released.', this.resLoadNumMap.toArray())
     }

    /**
     * 清理资源，微信平台清理小游戏缓存
     * @param  {function} callback
     */
    cleanAllAssets(callback) {
        console.log('微信平台清理小游戏缓存');
        
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
            console.log('cleanDir ' + dir);
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
                                            console.log('Removed local file ' + path + ' successfully!');
                                        },
                                        fail: !CC_DEBUG ? null : (res) => {
                                            console.warn('Failed to remove file(' + path + '): ' + res ? res.errMsg : 'unknown error');
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
                console.warn('fail to readdir:' + dir);
                if (callback) callback();
            }
        });
    }

    /**微信退出 */
    restart () {
        console.log('微信退出');
        wx.exitMiniProgram({
            complete: () => {
                console.log('exit complete');
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
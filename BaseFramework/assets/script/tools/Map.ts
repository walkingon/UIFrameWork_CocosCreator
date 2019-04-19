import { Tools } from "./Tools";

/**
 * 循环map的一个接口
 */
export interface ILoopMapFunction<Val> {

    (key: string, val: Val): boolean| void;
}

export abstract class Map<Key extends number|string, Val> {
    protected _size: number = 0;

    /**
     * 插入map一个key val
     * @param key
     * @param val
     */
    public put(key: Key, val: Val): void {
        if (! this.containsKey(key)) {
            this._size++;
        }
        this.getTable()[key] = val;
    }
    /**
     *
     * @param key 获得某个key 的值
     */
    public get(key: Key): Val {
        let val: Val = this.getTable()[key];
        if (Tools.isNullOrUndefined(val)) {
            return null;
        }
        return val;
    }
    /**
     *
     * @param key 设置某个key 的值
     */
    public set(key: Key, val: Val){
        this.put(key, val)
    }
    /**
     * 删除某个key
     * @param key
     */
    public remove(key: Key):Val {
        let ret:Val = null;
        if (this.containsKey(key)){
            ret = this.get(key);
            this._size --;
        }
        delete this.getTable()[key];
        return ret;
    }

    public clear(){
        for (let key in this.getTable()) {
            delete this.getTable()[key];
        }
        this._size = 0;
    }

    protected abstract getTable():any;
    /**
     * size
     */
    public size(): number {
        return this._size;
    }
    /**
     * 是否是空
     */
    public isEmpty():boolean{
        return this._size == 0;
    }
    /**
     * map是否有该key
     * @param key
     */
    public containsKey(key: Key) : boolean {
        return ! Tools.isNullOrUndefined(this.getTable()[key]);
    }
    /**
     * 循环map的一个方法
     * @param loopFunction
     */
    public foreach(loopFunction: ILoopMapFunction<Val>) {
        for (let key in this.getTable()) {
            if (loopFunction(key, this.getTable()[key]) == true) {
                break;
            }
        }
    }

    /**
     * 序列化为ArrayList
     * @returns {Array<Val>}
     */
    public toArray():Array<Val> {
        let list: Array<Val> = new Array();
        for (let key in this.getTable()) {
            list.push(this.getTable()[key]);
        }
        return list;
    }

    public has(key){
        return this.get(key) != null
    }
}

/**
 * 屏蔽界面点击
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class TouchBlock extends cc.Component {

    @property(cc.Node)
    private loadingNode:cc.Node = null

    @property(cc.RichText)
    private descRlb:cc.RichText = null

    onload(){
        this.loadingNode.active = false
        this.descRlb.string = ''
    }

    /**
     * 显示loading
     * @param show 
     */
    showLoading(show:boolean){
        this.loadingNode.active = show
    }

    /**
     * 显示提示
     * @param str 
     */
    showDesc(str:string){
        this.descRlb.string = str
    }
}

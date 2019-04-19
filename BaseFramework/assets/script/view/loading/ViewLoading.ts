import { ViewBase } from "../base/ViewBase";
import { ViewManager } from "../../controller/ViewManager";
import { ViewLogin } from "../login/ViewLogin";

const {ccclass, property} = cc._decorator;

/**loading界面 */
@ccclass
export class ViewLoading extends ViewBase{
    static prafabPath = 'prefab/loading/ViewLoading'

    isFullScreen = true

    onOpen(data){

    }


    onClickClose(){
        ViewManager.getInstance().closeView({View:ViewLoading})
    }

    onClickNext(){
        ViewManager.getInstance().openView({View:ViewLogin, CustomData: 'hahah'})
    }


    onClose(){

    }

    onHide(){

    }

    onShow(){

    }

    onReceiveMessage(msg:any){

    }
}
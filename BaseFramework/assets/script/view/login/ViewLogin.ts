import { ViewBase } from "../base/ViewBase";
import { ViewManager } from "../../controller/ViewManager";
import { ViewHome } from "../home/ViewHome";

const {ccclass, property} = cc._decorator;

/**login界面 */
@ccclass
export class ViewLogin extends ViewBase{
    static prafabPath = 'prefab/login/ViewLogin'

    isFullScreen = true

    onOpen(data){
        
    }


    onClickClose(){
        ViewManager.getInstance().closeView({View:ViewLogin})
    }

    onClickNext(){
        ViewManager.getInstance().openView({View:ViewHome, CustomData: '从登陆界面进入'})
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
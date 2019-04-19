import { ViewBase } from "../base/ViewBase";
import { ViewManager } from "../../controller/ViewManager";

const {ccclass, property} = cc._decorator;

/**game界面 */
@ccclass
export class ViewGame extends ViewBase{
    static prafabPath = 'prefab/game/ViewGame'

    isFullScreen = true

    onOpen(data){
        
    }


    onClickClose(){
        ViewManager.getInstance().closeView({View:ViewGame})
    }

    onClickNext(){

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
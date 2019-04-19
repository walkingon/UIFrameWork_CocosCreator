import { ViewBase } from "../base/ViewBase";
import { ViewManager } from "../../controller/ViewManager";
import { ViewGame } from "../game/ViewGame";

const {ccclass, property} = cc._decorator;

/**home界面 */
@ccclass
export class ViewHome extends ViewBase{
    static prafabPath = 'prefab/home/ViewHome'

    isFullScreen = true

    onOpen(data){
       
    }


    onClickClose(){
        ViewManager.getInstance().closeView({View:ViewHome})
    }

    onClickNext(){
        ViewManager.getInstance().openView({View:ViewGame, CustomData: '从家园进入'})
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
import { ViewManager } from "./controller/ViewManager";
import { ViewLoading } from "./view/loading/ViewLoading";
import { ScreenAdapter } from "./tools/ScreenAdapter";

/**
 * 启动入口
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class Launch extends cc.Component {

    start(){
        ScreenAdapter.getInstance().screenFit()
        ViewManager.getInstance().openView({View: ViewLoading})
    }
    
}

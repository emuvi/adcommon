import { QinTool } from "qinpel-cps";
import { AdRegister } from "./ad-register";
import { AdSelect } from "./ad-select";

export class AdRegLoader {
  private _register: AdRegister;

  public constructor(register: AdRegister) {
    this._register = register;
  }

  public start() {
    let select = {
      registry: this._register.registry,
    } as AdSelect;
    QinTool.qinpel.talk
      .post("/reg/ask", select)
      .then((res) => {
        console.log(res.data);
        let rows = QinTool.qinpel.our.soul.body.getCSVRows(res.data);
        for (let row of rows) {
          console.log(row);
        }
      })
      .catch((err) => {
        QinTool.qinpel.jobbed.statusError(err, "{adcommon}(ErrCode-000002)");
      });
  }
}

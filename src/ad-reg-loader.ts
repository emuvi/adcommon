import { QinTool } from "qinpel-cps";
import { AdFilter } from "./ad-filter";
import { AdRegister } from "./ad-register";
import { AdSelect } from "./ad-select";

export class AdRegLoader {
  private _reg: AdRegister;

  public constructor(register: AdRegister) {
    this._reg = register;
  }

  public load() {
    let registry = this._reg.registry;
    let fields = this._reg.model.typeds;
    let filters: AdFilter[] = null;
    if (this._reg.expect.filters) {
      filters = [...this._reg.expect.filters];
    }
    let searching = this._reg.search.getFilters();
    if (searching) {
      filters = filters || [];
      filters.push(...searching);
    }
    let select = { registry, fields, filters } as AdSelect;
    QinTool.qinpel.talk
      .post("/reg/ask", select)
      .then((res) => {
        this._reg.table.delLines();
        let rows = QinTool.qinpel.our.soul.body.getCSVRows(res.data);
        if (rows) {
          for (let row of rows) {
            this._reg.table.addLine(row);
          }
        }
      })
      .catch((err) => {
        QinTool.qinpel.jobbed.statusError(err, "{adcommon}(ErrCode-000002)");
      });
  }
}

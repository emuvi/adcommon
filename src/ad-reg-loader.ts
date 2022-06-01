import { QinTool } from "qinpel-cps";
import { AdFilter } from "./ad-filter";
import { AdRegister } from "./ad-register";
import { AdSelect } from "./ad-select";

export class AdRegLoader {
  private _reg: AdRegister;

  public constructor(register: AdRegister) {
    this._reg = register;
  }

  public load(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let registry = this._reg.registry;
      let fields = this._reg.model.typeds;
      let joins = this._reg.base.joins;
      let filters: AdFilter[] = null;
      if (this._reg.base.filters) {
        if (filters == null) {
          filters = [];
        }
        filters.push(...this._reg.base.filters);
      }
      if (this._reg.expect.filters) {
        if (filters == null) {
          filters = [];
        }
        filters.push(...this._reg.expect.filters);
      }
      let searchingFor = this._reg.search.getFilters();
      if (searchingFor) {
        if (filters == null) {
          filters = [];
        }
        filters.push(...searchingFor);
      }
      let orders = this._reg.base.orders;
      let select = { registry, fields, joins, filters, orders } as AdSelect;
      QinTool.qinpel.talk
        .post("/reg/ask", select)
        .then((res) => {
          this._reg
            .unselectAll()
            .then(() => {
              this._reg.table.delLines();
              let rows = QinTool.qinpel.our.soul.body.getCSVRows(res.data);
              if (rows) {
                for (let row of rows) {
                  this._reg.table.addLine(row);
                }
              }
              resolve();
            })
            .catch((err) => {
              reject(err);
            });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

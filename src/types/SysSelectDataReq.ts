// 自动生成的代码块，首行
// 禁止修改 #HASH<1b7791205e1457398dcff79ffffd5a5785ee7a9c00248c24364c303b8a91341c>HASH#
// 如果该代码块被修改，下次执行生成操作时，则不会更新该代码块。
// 如果修改了代码块，且希望重新生成，可以删除这几行注释，该文件会强制重新生成。
import { SysSelectDataReqCondition } from "./SysSelectDataReqCondition";
import { SysSelectDataReqOrderBy } from "./SysSelectDataReqOrderBy";

export interface SysSelectDataReq {
  /**  */
  columns: string[];
  /**  */
  conditions: SysSelectDataReqCondition[];
  /**  */
  orderBys: SysSelectDataReqOrderBy[];
  /**  */
  page: number;
  /**  */
  pageSize: number;
  /**  */
  pageTag: string;
}
// 自动生成的代码块，尾行

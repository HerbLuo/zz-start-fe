// 自动生成的代码块，首行
// 禁止修改 #HASH<3a5a63dbd30d5f17cee51072e960b829e6c4e3657d925b73bcf18026bb1fcd55>HASH#
// 如果该代码块被修改，下次执行生成操作时，则不会更新该代码块。
// 如果修改了代码块，且希望重新生成，可以删除这几行注释，该文件会强制重新生成。
import { SysQueryCondition } from "./SysQueryCondition";
import { SysQueryDataReqOrderBy } from "./SysQueryDataReqOrderBy";

export interface SysQueryDataReq {
  /**  */
  conditions: SysQueryCondition[];
  /**  */
  orderBys: SysQueryDataReqOrderBy[];
  /**  */
  page: number;
  /**  */
  pageSize: number;
  /**  */
  tag: string;
}
// 自动生成的代码块，尾行

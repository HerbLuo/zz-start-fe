// 自动生成的代码块，首行
// 禁止修改 #HASH<0ad6f3c6626b4893a09d67793098da4b85ad0380d08cc58509ab3e672974ec81>HASH#
// 如果该代码块被修改，下次执行生成操作时，则不会更新该代码块。
// 如果修改了代码块，且希望重新生成，可以删除这几行注释，该文件会强制重新生成。
import { SysQueryCondition } from "./SysQueryCondition";

export interface SysQueryDataReq {
  /**  */
  asc: boolean;
  /**  */
  conditions: SysQueryCondition[];
  /**  */
  orderBy: string;
  /**  */
  page: number;
  /**  */
  pageSize: number;
  /**  */
  tag: string;
}
// 自动生成的代码块，尾行

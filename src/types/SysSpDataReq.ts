// 自动生成的代码块，首行
// 禁止修改 #HASH<5f43c4882f900e70bf5c37ecd38c07890601adc8d9ec7b3d049d2544e2bf27ac>HASH#
// 如果该代码块被修改，下次执行生成操作时，则不会更新该代码块。
// 如果修改了代码块，且希望重新生成，可以删除这几行注释，该文件会强制重新生成。
import { SysSpDataReqCondition } from "./SysSpDataReqCondition";
import { SysSpDataReqOrderBy } from "./SysSpDataReqOrderBy";

export interface SysSpDataReq {
  /**  */
  columns: string[];
  /**  */
  conditions: SysSpDataReqCondition[];
  /**  */
  orderBys: SysSpDataReqOrderBy[];
  /**  */
  page: number;
  /**  */
  pageSize: number;
  /**  */
  pageTag: string;
}
// 自动生成的代码块，尾行

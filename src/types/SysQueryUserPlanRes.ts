// 自动生成的代码块，首行
// 禁止修改 #HASH<9e08efe9f0cbaaac4c83fad4eb292d7166d3c9690f347529b516565aa24745ec>HASH#
// 如果该代码块被修改，下次执行生成操作时，则不会更新该代码块。
// 如果修改了代码块，且希望重新生成，可以删除这几行注释，该文件会强制重新生成。
import { SysQueryUserTableColumnEntity } from "./SysQueryUserTableColumnEntity";
import { SysQueryElementEntity } from "./SysQueryElementEntity";
import { SysQueryUserPlan } from "./SysQueryUserPlan";

export interface SysQueryUserPlanRes {
  /**  */
  columns: SysQueryUserTableColumnEntity[];
  /**  */
  elements: SysQueryElementEntity[];
  /**  */
  plans: SysQueryUserPlan[];
}
// 自动生成的代码块，尾行

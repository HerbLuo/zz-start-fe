// 自动生成的代码块，首行
// 禁止修改 #HASH<0073d4cd17b4cab605c90f567ac3b45291d8b2fd2ef15edb26c067607fcb76d4>HASH#
// 如果该代码块被修改，下次执行生成操作时，则不会更新该代码块。
// 如果修改了代码块，且希望重新生成，可以删除这几行注释，该文件会强制重新生成。
import { SysSelectUserTableColumnEntity } from "./SysSelectUserTableColumnEntity";
import { SysSelectElementEntity } from "./SysSelectElementEntity";
import { SysSelectUserPlan } from "./SysSelectUserPlan";

export interface SysSelectUserPlanRes {
  /**  */
  columns: SysSelectUserTableColumnEntity[];
  /**  */
  elements: SysSelectElementEntity[];
  /**  */
  pageTag: string;
  /**  */
  plans: SysSelectUserPlan[];
}
// 自动生成的代码块，尾行

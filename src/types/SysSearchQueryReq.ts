// 自动生成的代码块，首行
// 禁止修改 #HASH<c5f0cecd79d30f1fa7d5a3cd72214dc74ae3fab4d31b577ab34c1af2c5fd5d9e>HASH#
// 如果该代码块被修改，下次执行生成操作时，则不会更新该代码块。
// 如果修改了代码块，且希望重新生成，可以删除这几行注释，该文件会强制重新生成。
import { SysSearchQueryCondition } from "./SysSearchQueryCondition";

export interface SysSearchQueryReq {
  asc: boolean;
  conditions: SysSearchQueryCondition[];
  orderBy: string;
  page: number;
  pageSize: number;
  tag: string;
}
// 自动生成的代码块，尾行

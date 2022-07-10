// 自动生成的代码块，首行
// 禁止修改 #HASH<036b89b2f8be155c569a718c89863fa9b8662ac84a4524dd375199267ecceea9>HASH#
// 如果该代码块被修改，下次执行生成操作时，则不会更新该代码块。
// 如果修改了代码块，且希望重新生成，可以删除这几行注释，该文件会强制重新生成。

export interface SysQueryElementEntity {
  /** 属性名(作为字段名) */
  alias: string;
  /** 属性名(显示用) */
  aliasCn: string;
  /** 创建者 */
  createBy: string;
  /** 创建时间 */
  createTime: Date;
  /** 删除标志 */
  deleted: boolean;
  /** 隐藏 */
  hidden: boolean;
  /** ID */
  id: number;
  /** 允许的搜索条件 */
  limitConditions: string;
  /** 限定类型(可选)(values, dictionary, select_option, url) */
  limitType: string;
  /** 限定值 */
  limitValues: string;
  /** 排序字段 */
  orderByColumn: boolean;
  /** 倒序排序字段 */
  orderByDesc: boolean;
  /** 备注 */
  remark: string;
  /** 排序 */
  sort: number;
  /** 属性sql */
  sqlColumn: string;
  /** 状态[init, wait, success, invalid, cancel, invalid_wait, cancel_wait, reject] */
  status: string;
  /** 主键ID */
  sysQueryId: number;
  /** 方案名(冗余字段) */
  sysQueryTagCnRedundant: string;
  /** 类型(text, select, number, time, date, date-time, month, year) */
  type: string;
  /** 更新者 */
  updateBy: string;
  /** 更新时间 */
  updateTime: Date;
}
// 自动生成的代码块，尾行

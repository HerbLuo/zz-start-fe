// 自动生成的代码块，首行
// 禁止修改 #HASH<aa842bf05fd665314f374f59b8396b6d91568ffc25a5377f522224d164f85971>HASH#
// 如果该代码块被修改，下次执行生成操作时，则不会更新该代码块。
// 如果修改了代码块，且希望重新生成，可以删除这几行注释，该文件会强制重新生成。

export interface SysQueryUserPlanItemEntity {
  /** 字段sql */
  columnSql: string;
  /** 创建者 */
  createBy: string;
  /** 创建时间 */
  createTime: Date;
  /** 删除标志 */
  deleted: boolean;
  /** ID */
  id: number;
  /** 备注 */
  remark: string;
  /** 条件 */
  searchCondition: string;
  /** 值 */
  searchValue: string;
  /** 排序 */
  sort: number;
  /** 状态[init, wait, success, invalid, cancel, invalid_wait, cancel_wait, reject] */
  status: string;
  /** 对应的查询方案列ID */
  sysQueryElementId: number;
  /**  */
  sysQueryId: number;
  /** 查询方案配置名(冗余) */
  sysQueryTagCnRedundant: number;
  /** 表头ID */
  sysQueryUserPlanId: number;
  /** 用户ID(冗余) */
  sysUserIdRedundant: number;
  /** 更新者 */
  updateBy: string;
  /** 更新时间 */
  updateTime: Date;
}
// 自动生成的代码块，尾行

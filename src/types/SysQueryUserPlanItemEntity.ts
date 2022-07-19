// 自动生成的代码块，首行
// 禁止修改 #HASH<37b49bda103263293abf501d47ab95800fe7d3a9fcdc76659eb5a857694d91b1>HASH#
// 如果该代码块被修改，下次执行生成操作时，则不会更新该代码块。
// 如果修改了代码块，且希望重新生成，可以删除这几行注释，该文件会强制重新生成。

export interface SysQueryUserPlanItemEntity {
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
  /** 查询方案字段名(冗余) */
  sysQueryElementAliasCnRedundant: string;
  /** 对应的查询方案列ID */
  sysQueryElementId: number;
  /**  */
  sysQueryId: number;
  /** 查询方案配置名(冗余) */
  sysQueryTagCnRedundant: string;
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

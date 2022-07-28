// 自动生成的代码块，首行
// 禁止修改 #HASH<cb0ada55c95576f32c8f2006ca06194050c03568873a1c4d1d055578d9ecbcb4>HASH#
// 如果该代码块被修改，下次执行生成操作时，则不会更新该代码块。
// 如果修改了代码块，且希望重新生成，可以删除这几行注释，该文件会强制重新生成。

export interface SysSpUsrPlanItemEntity {
  /** 查询方案字段名(冗余) */
  aliasCn: string;
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
  sysSpEleId: number;
  /**  */
  sysSpId: number;
  /** 表头ID */
  sysSpUsrPlanId: number;
  /** 用户ID(冗余) */
  sysUserId: number;
  /** 查询方案配置名(冗余) */
  tagCn: string;
  /** 更新者 */
  updateBy: string;
  /** 更新时间 */
  updateTime: Date;
}
// 自动生成的代码块，尾行

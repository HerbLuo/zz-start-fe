// 自动生成的代码块，首行
// 禁止修改 #HASH<fa3d2761b8996f8224760aba08502398eb9ca39a5ee872ba15f454e82f45ac30>HASH#
// 如果该代码块被修改，下次执行生成操作时，则不会更新该代码块。
// 如果修改了代码块，且希望重新生成，可以删除这几行注释，该文件会强制重新生成。

export interface SysSelectUserPlanItemEntity {
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
  sysSelectElementId: number;
  /**  */
  sysSelectId: number;
  /** 表头ID */
  sysSelectUserPlanId: number;
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

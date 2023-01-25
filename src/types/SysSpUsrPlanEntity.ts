// 自动生成的代码块，首行
// 禁止修改 #HASH<fa2bfffd25d9c0f1a6f51c5d013b9462570f3a7d24dba755eaf0c12bce492994>HASH#
// 如果该代码块被修改，下次执行生成操作时，则不会更新该代码块。
// 如果修改了代码块，且希望重新生成，可以删除这几行注释，该文件会强制重新生成。

export interface SysSpUsrPlanEntity {
  /** 创建者 */
  createBy: string;
  /** 创建时间 */
  createTime: Date;
  /**  */
  default: boolean;
  /** 删除标志 */
  deleted: boolean;
  /** ID */
  id: number;
  /** 用户定义的查询方案名称 */
  name: string;
  /** page tag */
  pageTag: string;
  /**  */
  public: boolean;
  /** 备注 */
  remark: string;
  /** 排序 */
  sort: number;
  /** 状态[init, wait, success, invalid, cancel, invalid_wait, cancel_wait, reject] */
  status: string;
  /** 查询方案 */
  sysSpId: number;
  /** 用户ID */
  sysUserId: number;
  /** 方案配置名(冗余字段) */
  tagCn: string;
  /** 更新者 */
  updateBy: string;
  /** 更新时间 */
  updateTime: Date;
}
// 自动生成的代码块，尾行

// 自动生成的代码块，首行
// 禁止修改 #HASH<151a6f4ef7abd53565526b70351aaa2ca0cf83b6f4a9d9c3fce9badc19e24796>HASH#
// 如果该代码块被修改，下次执行生成操作时，则不会更新该代码块。
// 如果修改了代码块，且希望重新生成，可以删除这几行注释，该文件会强制重新生成。

export interface SysSpUsrPlanEntity {
  /** 创建者 */
  createBy: string;
  /** 创建时间 */
  createTime: Date;
  /** 是否为默认方案 */
  default: boolean;
  /** 删除标志 */
  deleted: boolean;
  /** ID */
  id: number;
  /** 用户定义的查询方案名称 */
  name: string;
  /** page tag */
  pageTag: string;
  /** 只读（针对公用方案, 只能拷贝不能修改） */
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

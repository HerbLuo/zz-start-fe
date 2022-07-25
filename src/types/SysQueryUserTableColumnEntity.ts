// 自动生成的代码块，首行
// 禁止修改 #HASH<b1e9acd7eeb5fa4a29d3cae790d87586a722e3b3ec0998de52c478319244c070>HASH#
// 如果该代码块被修改，下次执行生成操作时，则不会更新该代码块。
// 如果修改了代码块，且希望重新生成，可以删除这几行注释，该文件会强制重新生成。

export interface SysQueryUserTableColumnEntity {
  /** 创建者 */
  createBy: string;
  /** 创建时间 */
  createTime: Date;
  /** 数据键名 */
  dataIndex: string;
  /** 删除标志 */
  deleted: boolean;
  /** 是否隐藏 */
  hidden: boolean;
  /** 可隐藏的 */
  hideAble: boolean;
  /** ID */
  id: number;
  /** page tag */
  pageTag: string;
  /** 备注 */
  remark: string;
  /** 排序信息 */
  sort: number;
  /** 是否允许排序(对于操作列，是不能排序的) */
  sortable: boolean;
  /** 状态[init, wait, success, invalid, cancel, invalid_wait, cancel_wait, reject] */
  status: string;
  /** 对应的查询方案列ID */
  sysQueryElementId: number;
  /** 用户ID */
  sysUserId: number;
  /** 列名 */
  title: string;
  /** 列类型 */
  type: string;
  /** 更新者 */
  updateBy: string;
  /** 更新时间 */
  updateTime: Date;
  /** 宽度 */
  width: string;
}
// 自动生成的代码块，尾行

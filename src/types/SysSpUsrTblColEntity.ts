// 自动生成的代码块，首行
// 禁止修改 #HASH<e4f47aa645d9b6e1e395d6a722c7a49ef68f0642e2e5afea6cce747a438e59cc>HASH#
// 如果该代码块被修改，下次执行生成操作时，则不会更新该代码块。
// 如果修改了代码块，且希望重新生成，可以删除这几行注释，该文件会强制重新生成。

export interface SysSpUsrTblColEntity {
  /** 创建者 */
  createBy: string;
  /** 创建时间 */
  createTime: Date;
  /**  */
  css: string;
  /** 数据键名 */
  dataIndex: string;
  /** 删除标志 */
  deleted: boolean;
  /** 固定列，不允许排序 right, left */
  fixed: string;
  /** 是否隐藏 */
  hidden: boolean;
  /** ID */
  id: number;
  /** 存在多个order_by字段时的先后顺序 */
  orderByIndex: number;
  /** asc, desc */
  orderBy_column: string;
  /** page tag */
  pageTag: string;
  /** 备注 */
  remark: string;
  /**  */
  render: string;
  /** 拖拽排序信息 */
  sort: number;
  /** 状态[init, wait, success, invalid, cancel, invalid_wait, cancel_wait, reject] */
  status: string;
  /** 对应的查询方案列ID */
  sysSpEleId: number;
  /** 用户ID */
  sysUserId: number;
  /** 列名 */
  title: string;
  /** 列类型(text, select, number, money, time, date, date-time, month, year) */
  type: string;
  /** 更新者 */
  updateBy: string;
  /** 更新时间 */
  updateTime: Date;
  /** 宽度 */
  width: string;
}
// 自动生成的代码块，尾行

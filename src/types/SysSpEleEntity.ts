// 自动生成的代码块，首行
// 禁止修改 #HASH<d7b58f0fa1011b70c5b6a37c2e56f76b89c80dbf8d0fae313158771be03d3d3c>HASH#
// 如果该代码块被修改，下次执行生成操作时，则不会更新该代码块。
// 如果修改了代码块，且希望重新生成，可以删除这几行注释，该文件会强制重新生成。

export interface SysSpEleEntity {
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
  /** 固定列，不允许排序 right, left */
  fixed: string;
  /** 是否在列表中隐藏 */
  hidden: boolean;
  /** ID */
  id: number;
  /** 允许的搜索条件 */
  limitConditions: string;
  /** 限定类型(可选)(values, dictionary, select_option, url) */
  limitType: string;
  /** 限定值 */
  limitValues: string;
  /** 存在多个order_by字段时的先后顺序 */
  orderByIndex: number;
  /** asc, desc */
  orderBy_column: string;
  /** 备注 */
  remark: string;
  /** 拖拽排序信息 */
  sort: number;
  /** 属性sql */
  sql_column: string;
  /** 状态[init, wait, success, invalid, cancel, invalid_wait, cancel_wait, reject] */
  status: string;
  /** 主键ID */
  sysSpId: number;
  /** 方案名(冗余字段) */
  tagCn: string;
  /** 类型(text, select, number, time, date, date-time, month, year) */
  type: string;
  /** 更新者 */
  updateBy: string;
  /** 更新时间 */
  updateTime: Date;
  /** 宽度 */
  width: string;
}
// 自动生成的代码块，尾行

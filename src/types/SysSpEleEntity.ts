// 自动生成的代码块，首行
// 禁止修改 #HASH<5655fdf9868e4d55d1e1aa3aaa81feba2b39bfb4909be6ca6d71221ac29c10d9>HASH#
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
  /**  */
  css: string;
  /** e.g. `YYYY-MM-DD HH:mm:ss`. see: https://day.js.org/docs/en/parse/string-format */
  datetimeFormat: string;
  /** 删除标志 */
  deleted: boolean;
  /** 固定列，不允许拖拽排序 right, left */
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
  /**  */
  orderBy: string;
  /** 存在多个order_by字段时的先后顺序 */
  orderByIndex: number;
  /** 备注 */
  remark: string;
  /**  */
  render: string;
  /** 拖拽排序信息 */
  sort: number;
  /**  */
  sql: string;
  /** 状态[init, wait, success, invalid, cancel, invalid_wait, cancel_wait, reject] */
  status: string;
  /** 主键ID */
  sysSpId: number;
  /** 方案名(冗余字段) */
  tagCn: string;
  /** 类型(text, select, number, time, date, datetime, month, year) */
  type: string;
  /** 更新者 */
  updateBy: string;
  /** 更新时间 */
  updateTime: Date;
  /** 宽度 */
  width: string;
}
// 自动生成的代码块，尾行

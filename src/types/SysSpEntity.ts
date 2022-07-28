// 自动生成的代码块，首行
// 禁止修改 #HASH<a2015026e45a26e72d787056dc2ff91ceb2c6f7c61387a4b2affadabe7a6298d>HASH#
// 如果该代码块被修改，下次执行生成操作时，则不会更新该代码块。
// 如果修改了代码块，且希望重新生成，可以删除这几行注释，该文件会强制重新生成。

export interface SysSpEntity {
  /** 创建者 */
  createBy: string;
  /** 创建时间 */
  createTime: Date;
  /** 删除标志 */
  deleted: boolean;
  /** hash */
  hash: string;
  /** ID */
  id: number;
  /** 备注 */
  remark: string;
  /** sql */
  sqlColumn: string;
  /** 状态[init, wait, success, invalid, cancel, invalid_wait, cancel_wait, reject] */
  status: string;
  /** 方案名(可用于查询，唯一) */
  tag: string;
  /** 方案名(备注, 可为中文) */
  tagCn: string;
  /** 更新者 */
  updateBy: string;
  /** 更新时间 */
  updateTime: Date;
}
// 自动生成的代码块，尾行

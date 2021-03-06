// 自动生成的代码块，首行
// 禁止修改 #HASH<42025d9561ed80654e9f7e065010182e521aba81907ba5449d45fc03aab719ba>HASH#
// 如果该代码块被修改，下次执行生成操作时，则不会更新该代码块。
// 如果修改了代码块，且希望重新生成，可以删除这几行注释，该文件会强制重新生成。

export interface SysAttachmentEntity {
  /** 业务 */
  business: string;
  /** 业务ID */
  businessId: number;
  /** 创建者 */
  createBy: string;
  /** 创建时间 */
  createTime: Date;
  /** 删除标志 */
  deleted: boolean;
  /** 文件HASH */
  hash: string;
  /** ID */
  id: number;
  /** 文件名 */
  name: string;
  /** 备注 */
  remark: string;
  /** 文件大小(Byte) */
  size: number;
  /** 状态[init, wait, success, invalid, cancel, invalid_wait, cancel_wait, reject] */
  status: string;
  /** 更新者 */
  updateBy: string;
  /** 更新时间 */
  updateTime: Date;
}
// 自动生成的代码块，尾行

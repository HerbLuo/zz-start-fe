// 自动生成的代码块，首行
// 禁止修改 #HASH<70aff8c931d583e79fa2d4925abdb1f57f2a13adc1ff58a474b0f0a8e06ea94a>HASH#
// 如果该代码块被修改，下次执行生成操作时，则不会更新该代码块。
// 如果修改了代码块，且希望重新生成，可以删除这几行注释，该文件会强制重新生成。
import { put, get, post, del } from "./http";
import { AttachmentEntity } from "../types/AttachmentEntity";

/** 更新附件 */
async function updateAttachment(body: AttachmentEntity): Promise<boolean> {
  return await put(`/attachment`, body);
}

/** 获取附件列表 */
async function listAttachment(business: string, businessId: number): Promise<AttachmentEntity[]> {
  return await get(`/attachment/business/${business}/id/${businessId}`);
}

/** 上传附件 */
async function saveAttachment(business: string, businessId: number): Promise<AttachmentEntity> {
  return await post(`/attachment/business/${business}/id/${businessId}`);
}

/** 获取附件条数 */
async function getAttachmentCount(business: string, businessId: number): Promise<number> {
  return await get(`/attachment/business/${business}/id/${businessId}/count`);
}

/** 获取某业务的单个附件的url */
async function getAttachmentUrlLimit1(business: string, businessId: number): Promise<string> {
  return await get(`/attachment/business/${business}/id/${businessId}/url-limit-1`);
}

/** 批量获取附件条数 */
async function getAttachmentCount_1(business: string, businessIds: number[]): Promise<Record<string, number>> {
  return await get(`/attachment/business/${business}/ids/${businessIds}/count`);
}

/** 上传或替换附件 */
async function uploadOrReplaceAttachment(business: string, businessId: number): Promise<AttachmentEntity> {
  return await post(`/attachment/upload-or-replace/business/${business}/id/${businessId}`);
}

/** 删除附件 */
async function removeAttachment(id: number): Promise<boolean> {
  return await del(`/attachment/${id}`);
}

/** 获取单个附件的url */
async function getAttachmentUrl(id: number): Promise<string> {
  return await get(`/attachment/${id}/url`);
}

export const sysAttachmentApi = {
  updateAttachment,
  listAttachment,
  saveAttachment,
  getAttachmentCount,
  getAttachmentUrlLimit1,
  getAttachmentCount_1,
  uploadOrReplaceAttachment,
  removeAttachment,
  getAttachmentUrl,
};
// 自动生成的代码块，尾行

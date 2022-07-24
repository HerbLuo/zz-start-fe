// 自动生成的代码块，首行
// 禁止修改 #HASH<defe5267db0e7109b52a48ee97a3411d7d32ff2245a08d2f0a08d311f2ce263a>HASH#
// 如果该代码块被修改，下次执行生成操作时，则不会更新该代码块。
// 如果修改了代码块，且希望重新生成，可以删除这几行注释，该文件会强制重新生成。
import { basePath } from "./config";
import { put, get, post, del, RequestOptions } from "./http";
import { SysAttachmentEntity } from "../types/SysAttachmentEntity";

/** 更新附件 */
async function updateAttachment(body: SysAttachmentEntity, options?: RequestOptions): Promise<boolean> {
  return await put(`${basePath}/attachment`, body, options);
}

/** 获取附件列表 */
async function listAttachment(business: string, businessId: number, options?: RequestOptions): Promise<SysAttachmentEntity[]> {
  return await get(`${basePath}/attachment/business/${business}/id/${businessId}`, options);
}

/** 上传附件 */
async function saveAttachment(business: string, businessId: number, options?: RequestOptions): Promise<SysAttachmentEntity> {
  return await post(`${basePath}/attachment/business/${business}/id/${businessId}`, undefined, options);
}

/** 获取附件条数 */
async function getAttachmentCount(business: string, businessId: number, options?: RequestOptions): Promise<number> {
  return await get(`${basePath}/attachment/business/${business}/id/${businessId}/count`, options);
}

/** 获取某业务的单个附件的url */
async function getAttachmentUrlLimit1(business: string, businessId: number, options?: RequestOptions): Promise<string> {
  return await get(`${basePath}/attachment/business/${business}/id/${businessId}/url-limit-1`, options);
}

/** 批量获取附件条数 */
async function getAttachmentCount_1(business: string, businessIds: number[], options?: RequestOptions): Promise<Record<string, number>> {
  return await get(`${basePath}/attachment/business/${business}/ids/${businessIds}/count`, options);
}

/** 上传或替换附件 */
async function uploadOrReplaceAttachment(business: string, businessId: number, options?: RequestOptions): Promise<SysAttachmentEntity> {
  return await post(`${basePath}/attachment/upload-or-replace/business/${business}/id/${businessId}`, undefined, options);
}

/** 删除附件 */
async function removeAttachment(id: number, options?: RequestOptions): Promise<boolean> {
  return await del(`${basePath}/attachment/${id}`, undefined, options);
}

/** 获取单个附件的url */
async function getAttachmentUrl(id: number, options?: RequestOptions): Promise<string> {
  return await get(`${basePath}/attachment/${id}/url`, options);
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

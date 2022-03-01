import { put, get, post, del } from "./http";

async function updateAttachmentUsingPUT(attachment: [object Object]) {
  return put(`/attachment`);
}

async function listAttachmentUsingGET(business: undefined, businessId: undefined) {
  return get(`/attachment/business/{business}/id/{businessId}`);
}

async function saveAttachmentUsingPOST(business: undefined, businessId: undefined, file: [object Object]) {
  return post(`/attachment/business/{business}/id/{businessId}`);
}

async function getAttachmentCountUsingGET(business: undefined, businessId: undefined) {
  return get(`/attachment/business/{business}/id/{businessId}/count`);
}

async function getAttachmentUrlLimit1UsingGET(business: undefined, businessId: undefined) {
  return get(`/attachment/business/{business}/id/{businessId}/url-limit-1`);
}

async function getAttachmentCountUsingGET_1(business: undefined, businessIds: undefined) {
  return get(`/attachment/business/{business}/ids/{businessIds}/count`);
}

async function uploadOrReplaceAttachmentUsingPOST(business: undefined, businessId: undefined, file: [object Object]) {
  return post(`/attachment/upload-or-replace/business/{business}/id/{businessId}`);
}

async function removeAttachmentUsingDELETE(id: undefined) {
  return del(`/attachment/{id}`);
}

async function getAttachmentUrlUsingGET(id: undefined) {
  return get(`/attachment/{id}/url`);
}

export const sysAttachmentApi = {
  updateAttachmentUsingPUT,
  listAttachmentUsingGET,
  saveAttachmentUsingPOST,
  getAttachmentCountUsingGET,
  getAttachmentUrlLimit1UsingGET,
  getAttachmentCountUsingGET_1,
  uploadOrReplaceAttachmentUsingPOST,
  removeAttachmentUsingDELETE,
  getAttachmentUrlUsingGET
};

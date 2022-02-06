import { put, get, post, del } from "./http";

async function updateAttachmentUsingPUT(attachment: [object Object]) {
  return put(`/attachment`);
}

async function listAttachmentUsingGET(businessId: undefined, business: undefined) {
  return get(`/attachment/business/{business}/id/{businessId}`);
}

async function saveAttachmentUsingPOST(file: [object Object], businessId: undefined, business: undefined) {
  return post(`/attachment/business/{business}/id/{businessId}`);
}

async function getAttachmentCountUsingGET(businessId: undefined, business: undefined) {
  return get(`/attachment/business/{business}/id/{businessId}/count`);
}

async function getAttachmentUrlLimit1UsingGET(businessId: undefined, business: undefined) {
  return get(`/attachment/business/{business}/id/{businessId}/url-limit-1`);
}

async function getAttachmentCountUsingGET_1(businessIds: undefined, business: undefined) {
  return get(`/attachment/business/{business}/ids/{businessIds}/count`);
}

async function uploadOrReplaceAttachmentUsingPOST(file: [object Object], businessId: undefined, business: undefined) {
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

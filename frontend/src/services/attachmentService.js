import { axiosPrivate } from '../api/axios';

const ATTACHMENTS_BASE = '/tasks/attachments';

const getAttachments = async ({ limit = 5, offset = 0, task = '' } = {}) => {
  const params = {
    limit,
    offset
  };

  if (task) params.task = task;

  const response = await axiosPrivate.get(ATTACHMENTS_BASE + '/', { params });
  return response.data;
};

const uploadAttachment = async (formData, onUploadProgress) => {
  const response = await axiosPrivate.post(ATTACHMENTS_BASE + '/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress
  });
  return response.data;
};

const deleteAttachment = async (id) => {
  const response = await axiosPrivate.delete(`${ATTACHMENTS_BASE}/${id}/`);
  return response.data;
};

const getAttachmentById = async (id) => {
  const response = await axiosPrivate.get(`${ATTACHMENTS_BASE}/${id}/`);
  return response.data;
};

const attachmentService = {
  getAttachments,
  uploadAttachment,
  deleteAttachment,
  getAttachmentById
};

export default attachmentService;

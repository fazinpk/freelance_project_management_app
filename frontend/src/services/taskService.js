import { axiosPrivate } from "../api/axios";

const TASKS_BASE = "/tasks/list";

const getTasks = async ({
  limit = 5,
  offset = 0,
  search = "",
  status = "",
  priority = "",
  ordering = "",
} = {}) => {
  const params = {
    limit,
    offset,
  };

  if (search) params.search = search;
  if (status) params.status = status;
  if (priority) params.priority = priority;
  if (ordering) params.ordering = ordering;

  const response = await axiosPrivate.get(TASKS_BASE + "/", { params });
  return response.data;
};

const getTaskById = async (id) => {
  const response = await axiosPrivate.get(`${TASKS_BASE}/${id}/`);
  return response.data;
};

const createTask = async (taskData) => {
  const response = await axiosPrivate.post(TASKS_BASE + "/", taskData);
  return response.data;
};

const updateTask = async ({ id, taskData }) => {
  const response = await axiosPrivate.put(`${TASKS_BASE}/${id}/`, taskData);
  return response.data;
};

const deleteTask = async (id) => {
  const response = await axiosPrivate.delete(`${TASKS_BASE}/${id}/`);
  return response.data;
};

const taskService = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};

export default taskService;

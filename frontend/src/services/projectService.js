import { axiosPrivate } from '../api/axios';

const PROJECTS_BASE = '/projects';

const getProjects = async ({ limit = 5, offset = 0, search = '', ordering = '', client = '' } = {}) => {
  const params = {
    limit,
    offset,
  };

  if (search) params.search = search;
  if (ordering) params.ordering = ordering;
  if (client) params.client = client;

  const response = await axiosPrivate.get(PROJECTS_BASE + '/', { params });
  return response.data;
};

const getProjectById = async (id) => {
  const response = await axiosPrivate.get(`${PROJECTS_BASE}/${id}/`);
  return response.data;
};

const createProject = async (projectData) => {
  const response = await axiosPrivate.post(PROJECTS_BASE + '/', projectData);
  return response.data;
};

const updateProject = async ({ id, projectData }) => {
  const response = await axiosPrivate.put(`${PROJECTS_BASE}/${id}/`, projectData);
  return response.data;
};

const deleteProject = async (id) => {
  const response = await axiosPrivate.delete(`${PROJECTS_BASE}/${id}/`);
  return response.data;
};

const projectService = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};

export default projectService;

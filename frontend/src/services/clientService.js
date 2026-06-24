import { axiosPrivate } from '../api/axios';

const CLIENTS_BASE = '/clients';

const getClients = async ({ limit = 5, offset = 0, search = '', ordering = '' } = {}) => {
  const params = {
    limit,
    offset
  };

  if (search) {
    params.search = search;
  }

  if (ordering) {
    params.ordering = ordering;
  }

  const response = await axiosPrivate.get(CLIENTS_BASE + '/', { params });
  return response.data;
};

const getClientById = async (id) => {
  const response = await axiosPrivate.get(`${CLIENTS_BASE}/${id}/`);
  return response.data;
};

const createClient = async (clientData) => {
  const response = await axiosPrivate.post(CLIENTS_BASE + '/', clientData);
  return response.data;
};

const updateClient = async ({ id, clientData }) => {
  const response = await axiosPrivate.put(`${CLIENTS_BASE}/${id}/`, clientData);
  return response.data;
};

const deleteClient = async (id) => {
  const response = await axiosPrivate.delete(`${CLIENTS_BASE}/${id}/`);
  return response.data;
};

const clientService = {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient
};

export default clientService;

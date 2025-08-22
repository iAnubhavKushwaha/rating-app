import axios from "axios";
import { getToken } from "../utils/storage";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Fetch dashboard stats
export const getAdminStats = async () => {
  const res = await api.get("/stores/admin/dashboard");
  return res.data.data;
};

// Users
export const listUsers = async (filters) => {
  const res = await api.get("/users", { params: filters });
  return res.data;
};

export const createUser = async (userData) => {
  const res = await api.post("/users", userData);
  return res.data;
};

export const getUserById = async (id) => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

// Stores
export const listStores = async (filters) => {
  const res = await api.get("/stores", { params: filters });
  return res.data;
};

export const createStore = async (storeData) => {
  const res = await api.post("/stores/admin", storeData);
  return res.data;
};

export const getStoreById = async (id) => {
  const res = await api.get(`/stores/${id}`);
  return res.data;
};

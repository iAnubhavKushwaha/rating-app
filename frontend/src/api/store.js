import axios from "axios";
import { getToken } from "../utils/storage";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

export const createStore = async (data) =>
  (await API.post("/stores", data, { headers: { Authorization: `Bearer ${getToken()}` } })).data;

export const listStores = async (params = {}) => {
  try {
    const res = await API.get("/stores", {
      headers: { Authorization: getToken() ? `Bearer ${getToken()}` : undefined },
      params,
    });
    console.log("API response:", res.data); // 👈 log raw response
    return res.data;
  } catch (err) {
    console.error("listStores error:", err.response?.data || err.message);
    throw err;
  }
};


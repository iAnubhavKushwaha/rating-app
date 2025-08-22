import axios from "axios";
import { getToken } from "../utils/storage";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

export const signup = async (data) => {
    const res = await API.post("/auth/signup", data);
    return res.data;
}

export const login = async (data) => (await API.post("/auth/login", data)).data;
export const updatePassword = async (data) =>
  (await API.put("/users/me/password", data, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })).data;

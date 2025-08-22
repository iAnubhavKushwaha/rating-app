import axios from "axios";
import { getToken } from "../utils/storage"; // Make sure this path is correct

const API = axios.create({ baseURL: "http://localhost:5000/api" });

export const signup = async (data) => {
    const res = await API.post("/auth/signup", data);
    return res.data;
}

export const login = async (data) => (await API.post("/auth/login", data)).data;

export const resetPassword = async (email, currentPassword, newPassword) => {
    // Retrieve the token from storage
    const token = getToken();

    // Perform the patch request with the token in the authorization header
    const response = await API.patch('/users/me/password', {
        email,
        currentPassword,
        newPassword
    }, {
        headers: {
            Authorization: `Bearer ${token}` 
        }
    });

    return response.data; // Return the response data for further processing
};
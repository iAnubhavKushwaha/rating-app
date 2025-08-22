// frontend/src/context/authContext.jsx
import { createContext, useContext, useState } from "react";
import { getToken, getUser, setToken, removeToken, removeUser } from "../utils/storage";
import { login as loginAPI, signup as signupAPI } from "../api/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(getUser());
  const [token, setTokenState] = useState(getToken());

  const login = async (email, password) => {
    const data = await loginAPI({ email, password });
    const { token, user, role } = data; // Assuming this structure.

    setToken(token);
    const userWithRole = { ...user, role };
    setUserState(userWithRole);
    setTokenState(token);
    localStorage.setItem("user", JSON.stringify(userWithRole));

    return data;
  };

  const signup = async (name, email, address, password) => {
    const data = await signupAPI({ name, email, address, password });
    const { token, user, role } = data; // Assuming this structure.

    setToken(token);
    const userWithRole = { ...user, role };
    setUserState(userWithRole);
    setTokenState(token);
    localStorage.setItem("user", JSON.stringify(userWithRole));

    return data;
  };

  const logout = () => {
    removeToken();
    removeUser();
    setUserState(null);
    setTokenState(null);
    localStorage.removeItem("user"); // Clear user info
  };

  const value = { user, token, login, signup, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
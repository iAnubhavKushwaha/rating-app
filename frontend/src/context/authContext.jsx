// frontend/src/context/authContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { getToken, getUser, setToken, removeToken, removeUser } from "../utils/storage";
import { login as loginAPI, signup as signupAPI } from "../api/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(getUser());
  const [token, setTokenState] = useState(getToken());

  const login = async (email, password) => {
    const data = await loginAPI({ email, password });

    // Assuming the API response is structured correctly
    const { token, user, role } = data; // Destructure response to get token, user data, and role

    // Update the state and local storage
    setToken(token); // Store the token
    const userWithRole = { ...user, role }; // Combine user data with role
    setUserState(userWithRole); // Update user state with role
    setTokenState(token); // Update token state

    localStorage.setItem("user", JSON.stringify(userWithRole)); // Store user with role in local storage

    return data; // Return data for further processing if needed
  };

  const signup = async (name, email, address, password) => {
    const data = await signupAPI({ name, email, address, password });
    
    // Similar logic as login
    const { token, user, role } = data; // Assuming role is included in response
    setToken(token);
    const userWithRole = { ...user, role }; // Combine user data with role
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
  };

  const value = { user, token, login, signup, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
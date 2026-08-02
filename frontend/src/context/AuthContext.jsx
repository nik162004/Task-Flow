import { createContext, useContext, useState } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const login = async (userData) => {
    const data = await authService.login(userData);
    setToken(data.token);
    return data;
  };

  const register = async (userData) => {
    await authService.register(userData);

    const data = await authService.login({
        email: userData.email,
        password: userData.password,
    });

    setToken(data.token);

    return data;
  };

  const logout = () => {
    authService.logout();
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
import api from "../utils/axios";

export const register = async (userData) => {
    const response = await api.post("/users/register", userData);
    return response.data;
};

export const login = async (userData) => {
    const response = await api.post("/users/login", userData);
    
    if(response.data.token) {
        localStorage.setItem("token", response.data.token);
    }
    
    return response.data;
};

export const logout = () => {
    localStorage.removeItem("token");
}
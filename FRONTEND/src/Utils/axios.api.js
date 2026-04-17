import axios from "axios";
import { BASE_URL } from "./constant";

const api = axios.create({
        baseURL: BASE_URL,
        timeout: 10000,
        headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use(
        (config) => {
                const token = localStorage.getItem("token");
                if (token) {
                        config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
        },
        (error) => {
                return Promise.reject(error);
        }
);

// ✅ ADD THIS — handles invalid/expired token from server response
api.interceptors.response.use(
        (response) => {
                return response;
        },
        (error) => {
                if (error.response?.status === 401) {
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                }
                return Promise.reject(error);
        }
);

export default api;
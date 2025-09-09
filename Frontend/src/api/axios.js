// src/api/axios.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// 🔐 Attach token before every request except public login/register
API.interceptors.request.use((config) => {
  const noAuthNeeded = [
    "/users/login",
    "/users/register",
    "/workers/login",
    "/admin/login",
  ];

  // check if current request matches any public route
  const isPublic = noAuthNeeded.some((url) => config.url.includes(url));

  if (!isPublic) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// 🚨 Handle unauthorized globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");

      const pathname = window.location.pathname;
      if (pathname.startsWith("/admin")) {
        window.location.href = "/admin/login";
      } else if (pathname.startsWith("/worker")) {
        window.location.href = "/worker/login";
      } else {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default API;

// src/api/workerAxios.js
import axios from "axios";

const workerAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Automatically add worker token if available
workerAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("workerToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default workerAPI;

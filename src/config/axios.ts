import axios from "axios";
// https://main.d42zetgm2bmam.amplifyapp.com
const baseURL =
  typeof window !== "undefined"
    ? ""
    : process.env.NEXT_PUBLIC_BASEURL ?? "http://localhost:3000";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      window.dispatchEvent(new Event("auth_logout"));
    }
    return Promise.reject(err);
  }
);

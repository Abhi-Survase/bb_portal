import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_DOMAIN,
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`→ ${config.method?.toUpperCase()} ${config.url}`);
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers["authorization"] = token;
      // console.log(config.headers);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;

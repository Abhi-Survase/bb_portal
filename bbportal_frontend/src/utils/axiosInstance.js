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

axiosInstance.interceptors.response.use(
  (response) => response, // pass through successful responses untouched

  (error) => {
    if (error.response?.status === 403) {
      // Token expired or invalid → force logout
      console.log("Session expired. Redirecting to login!");
      localStorage.removeItem("auth_token");
      window.location.href = import.meta.env.VITE_LOGIN_URL;
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;

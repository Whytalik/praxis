import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;

axios.interceptors.request.use(
  (config) => {
    console.log("Request:", config);
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    console.log("Response:", response);
    return response;
  },
  (error) => {
    console.error("Response Error:", error);
    return Promise.reject(error);
  }
);

export default axios;

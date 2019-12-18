import axios from "axios";

const axiosClient = () => {
  const defaultOptions = {
    // baseURL: "http://localhost:8000",
    baseURL: "https://mymusix-server.herokuapp.com/",
    method: "get",
    headers: {
      "Content-Type": "application/json"
    }
  };

  // Create instance
  let instance = axios.create(defaultOptions);

  // Set the AUTH token for any request
  instance.interceptors.request.use(function(config) {
    const token = localStorage.getItem("token");
    config.headers.Authorization = token ? `JWT ${token}` : "";
    return config;
  });

  // instance.interceptors.response.use(
  //   (response) => {
  //     return response;
  //   },
  //   function(error) {
  //     // const originalRequest = error.config;
  //     if (error.response && error.response.status === 401) {
  //         localStorage.removeItem("token");
  //         localStorage.removeItem("userId");
  //         localStorage.removeItem("username");
  //     }
  //   }
  // );

  return instance;
};

export default axiosClient();

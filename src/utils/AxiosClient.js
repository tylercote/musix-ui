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

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    function(error) {
      // const originalRequest = error.config;
      if (error.response && error.response.status === 401) {
        // axios
        //   .post(
        //     "http://localhost:8000/token-auth/",
        //     {},
        //     {
        //       headers: {
        //         "Content-Type": "application/json"
        //       }
        //     }
        //   )
        //   .then((res) => {
        //     if (res.status === 200) {
        //       localStorage.setItem("token", res.data.token);
        //       localStorage.setItem("userId", res.data.user.id);
        //       localStorage.setItem("username", res.data.user.username);
        //       console.log("Change state 129");
        //       this.setState({
        //         loggedIn: true,
        //         displayed_form: "",
        //         username: res.data.user.username
        //       });
        //     }
        //   });
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
      }
    }
  );

  return instance;
};

export default axiosClient();

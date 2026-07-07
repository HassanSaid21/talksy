import axios from "axios";

export const AxiosInstance = axios.create({
    //TODOS put the real application domain
  baseURL:
    import.meta.env.MODE === "production"
      ? "https://your-production-api.com/api"
      : "http://localhost:3000/api",
  //  withCredentials: true,
});

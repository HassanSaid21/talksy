import axios from "axios";

export const AxiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "production"
      ? "https://your-production-api.com/api"
      : "http://localhost:3000/api",
  //  withCredentials: true,
});

import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";


export const AxiosInstance = axios.create({
  //TODOS put the real application domain
  baseURL:
    import.meta.env.MODE === "production"
      ? "https://your-production-api.com/api"
      : "http://localhost:5000/api",
  withCredentials: true, // Include cookies in requests
});


// Add a request interceptor to include the access token in the Authorization header
AxiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken; // i used useAuthStore.getState() to access the current state of the auth store outside of a React component. This allows me to get the latest access token for each request, even if the component is not re-rendered.

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Add a response interceptor to handle 401 errors and refresh the access token
AxiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // If there's no original request, reject the promise
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Prevent infinite retry loops
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
         const refreshUrl = `${AxiosInstance.defaults.baseURL}/auth/refresh`;
         const response = await axios.post(
           // i used axios.post instead of AxiosInstance.post to avoid triggering the interceptor again and causing an infinite loop. This way, the refresh token request is made directly without going through the interceptor.
           //TODOS put the real application domain
           refreshUrl,
           {},
           {
             withCredentials: true,
          },
        );

        const newAccessToken = response.data.accessToken;

        // Update Zustand
        useAuthStore.getState().setAccessToken(newAccessToken);

        // Update the failed request
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        // Retry original request
        return AxiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh token expired, revoked, or missing
        useAuthStore.getState().logout();
        console.error("Refresh token error:", refreshError);

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error); // If the error is not a 401 or if the retry fails, reject the promise
  },
);

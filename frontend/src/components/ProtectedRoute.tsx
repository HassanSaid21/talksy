import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { Loading } from "./Loading";
import { useEffect } from "react";
import { AxiosInstance } from "../lib/axios";
import axios from "axios";

export default function ProtectedRoute() {
  const { status, setAccessToken, logout } = useAuthStore();
   useEffect(() => {
     if (status !== "checking") return;
     const refreshUrl = `${AxiosInstance.defaults.baseURL}/auth/refresh`;
     axios
       .post(refreshUrl, {}, { withCredentials: true })
       .then((res) => setAccessToken(res.data.accessToken))
       .catch(() => logout());
   }, [status, setAccessToken, logout]);


  if (status === "checking") {
    return <Loading />;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
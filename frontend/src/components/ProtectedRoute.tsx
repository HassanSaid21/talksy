import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { Loading } from "./Loading";

export default function ProtectedRoute() {
  const {status} = useAuthStore();
 console.log("ProtectedRoute status:", status);
  if (status === "checking") {
    return <Loading />;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
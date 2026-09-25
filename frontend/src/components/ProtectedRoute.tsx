import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { Loading } from "./Loading";


export default function ProtectedRoute() {
  const { status } = useAuthStore();
 


  if (status === "checking") {
    return <Loading />;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login"  />;
  }

  return <Outlet />;
}
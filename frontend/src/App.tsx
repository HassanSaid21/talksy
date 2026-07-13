import { Navigate, Route, Routes } from "react-router";
import { homePath, loginPath, signupPath } from "./paths";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import AppBg from "./components/AppBg";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";


export default function App() {
    const {status} = useAuthStore();
  return (

    <AppBg>

   <Routes>
    {/* //TODOS add public route for settings, profile, and other pages that are not login or signup */}
    <Route element={<ProtectedRoute />}>
    
    <Route path={homePath()} element={<Home/>} />
    </Route>
   
       <Route path={loginPath()} element={status === "authenticated" ? <Navigate to="/" /> : <Login />} />
     <Route path={signupPath()} element={status === "authenticated" ? <Navigate to="/" /> : <Signup />} />
   </Routes>
   <Toaster/>
  </AppBg>
    
   
  )
}

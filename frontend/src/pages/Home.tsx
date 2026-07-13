// import { useEffect } from "react"
// import { AxiosInstance } from "../lib/axios";
// import type { AxiosError } from "axios";
// import { useAuthStore } from "../store/useAuthStore";


  

export default function Home() {
  // const { accessToken , user } = useAuthStore();
  // console.log("Access Token:", accessToken , "User:", user);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await AxiosInstance.get("/messages/chats");
  //       console.log("Protected data:", response.data);
  //     } catch (error:unknown) { 
  //       const errorMessage: { message?: string }  = (error as AxiosError).response?.data || { message: "An error occurred" };
  //       console.log("Error fetching protected data:", errorMessage.message) ;
  //     }
  //   };
    
  
  // fetchData();
  // }
  // , []);
  
  return (
    <button className='btn btn-primary'>home</button>
  )
}

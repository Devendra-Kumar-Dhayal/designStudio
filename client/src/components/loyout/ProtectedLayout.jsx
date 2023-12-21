import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import axios from "axios";

const ProtectedLayout = () => {
  const [isOpen, setisOpen] = useState(false);
  const navigate = useNavigate();

  
  const getUser = async () => {
    try {
      const user = await axios.get(`http://localhost:5000/api/auth/user/me`, {
        withCredentials: true,
      });
      if(!user) navigate("/login");
    } catch (error) {
      console.log(error);
      navigate("/login");
      
    }
  };
  
  useEffect(() => {
    console.log("url",process.env)
    getUser();
  }, []);

  console.log("protected");
  return (
    <div className="h-full min-h-screen w-full min-w-screen p-0 box-border overflow-y-scroll bg-[#F8F9FA] flex lg:gap-0 ">
      <div className="hidden lg:block">
        <Sidebar className="" />
      </div>
      <div className="min-h-screen mt-4 w-0 border-l  border-gray-300"></div>
      <div className="flex w-full flex-col  gap-6  md:mb-auto h-fit px-4">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedLayout;

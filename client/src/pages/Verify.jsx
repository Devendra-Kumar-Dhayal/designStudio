import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Googleauth from "./GoogleAuth";
import {
  Button,
  CircularProgress,
  Input,
  Modal,
  ModalContent,
} from "@nextui-org/react";
import axios from "axios";
import { BASEURL } from "../utils/functions";
import { toast } from "sonner";
import SideImg from "../assets/Design Studio.svg";


const Login = () => {
  const navigate = useNavigate();
  const handleSubmit = async (token) => {
    if (!token) {
      toast.error("Error");
      navigate("/login");
      return;
    }
    try {
      const response = await axios.post(
        `${BASEURL}/api/verify?token=${token}`,
        {},
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        toast.success("Verified")
        navigate({ pathname: "/change", search: `?token=${token}` });
      }
      // Handle the response here
    } catch (error) {
      toast.error("Error");
      console.log(error);
      // Handle the error here
    }
  };
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token");
    handleSubmit(token);
  }, []);

  return (
    <div className="flex  gap-2 ">
      <div className="w-1/2 h-screen bg-gradient-to-tr from-cyan-300 via-emerald-200 to-blue-300 flex items-center justify-center p-4">
        <img
          src={SideImg}
          alt="sideImg"
          className="max-w-[700px] drop-shadow-lg w-full"
        />
      </div>
      <div className="flex flex-col items-center justify-center w-1/2 h-screen">
        <CircularProgress />
      </div>
    </div>
  );
};

export default Login;

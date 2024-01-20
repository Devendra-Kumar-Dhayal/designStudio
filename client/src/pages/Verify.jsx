import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Googleauth from "./GoogleAuth";
import SideImg from "../assets/SideImg.png";
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
      <img src={SideImg} alt="sideImg" className=" w-1/2 h-screen" />
      <div className="flex flex-col items-center justify-center w-1/2 h-screen">
        <CircularProgress />
      </div>
    </div>
  );
};

export default Login;

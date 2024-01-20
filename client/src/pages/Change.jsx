import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Googleauth from "./GoogleAuth";
import SideImg from "../assets/SideImg.png";
import { Button, Input, Modal, ModalContent } from "@nextui-org/react";
import axios from "axios";
import { BASEURL } from "../utils/functions";
import { toast } from "sonner";

const Login = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {

      const response = await axios.post(
        `${BASEURL}/api/changepassword`,
        {
          password,
          passwordConfirmation,
        },
        {
          withCredentials: true,
        }
      );
      if (response.status===200) {
        toast.success(response.data.message)
        navigate("/");
      }
      // Handle the response here
    } catch (error) {
      toast.error("Error");
      console.log(error)
      // Handle the error here
    }
  };
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token");
    if(!token){
      toast.error("Error, Bad Request");
      navigate("/login");
      return
    }
  }, []);

  return (
    <div className="flex  gap-2 ">
      <img src={SideImg} alt="sideImg" className=" w-1/2 h-screen" />
      <div className="flex flex-col items-center justify-center w-1/2 h-screen">
        <div className="w-2/3 h-fit rounded-xl p-4 flex flex-col items-center justify-center shadow-medium gap-4">
          <h1 className="text-2xl font-semibold text-left ">Sign in</h1>

          <Input
            type="password"
            label="Password"
            value={password}
            onValueChange={setPassword}
          />
          <Input
            type="password"
            label="Confirm Password"
            value={passwordConfirmation}
            onValueChange={setPasswordConfirmation}
          />
          
          <Button
            auto
            shadow
            radius="full"
            className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
            onPress={handleSubmit}
          >
            Change Password
          </Button>
         


          
        </div>
      </div>
    </div>
  );
};

export default Login;

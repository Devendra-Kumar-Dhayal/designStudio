import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Googleauth from "./GoogleAuth";
import { Button, Input, Modal, ModalContent } from "@nextui-org/react";
import axios from "axios";
import { BASEURL } from "../utils/functions";
import { toast } from "sonner";
import SideImg from "../assets/Design Studio.svg";


const Login = () => {
  const [email, setEmail] = useState("");
  
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${BASEURL}/api/forgotpassword`,
        {
          email,
        },
        {
          withCredentials: true,
        }
      );
      if (response.status===201) {
        toast.success(response.data.message)
      }
      // Handle the response here
    } catch (error) {
      toast.error("Error");
      console.log(error)
      // Handle the error here
    }
  };

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
        <div className="w-2/3 h-fit rounded-xl p-4 flex flex-col items-center justify-center shadow-medium gap-4">
          <h1 className="text-2xl font-semibold text-left ">Sign in</h1>
          <Input
            type="email"
            label="Email"
            value={email}
            onValueChange={setEmail}
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
          <div className="w-full relative border-b my-4">
            <h1 className="absolute px-4 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white text-gray-400">
              OR
            </h1>
          </div>

          <Googleauth />

          <div className="flex text-lg text-gray-600 hover:text-slate-500 cursor-pointer   flex-start justify-start" onClick={()=>{
            navigate("/register")
          }}>
            Create Account?
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

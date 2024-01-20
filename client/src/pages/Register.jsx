import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Googleauth from "./GoogleAuth";
import SideImg from "../assets/SideImg.png";
import { Button, Input, Modal, ModalContent } from "@nextui-org/react";
import axios from "axios";
import { BASEURL } from "../utils/functions";
import { toast } from "sonner";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${BASEURL}/api/register`,
        {
          name,
          email,
          password,
          passwordConfirmation,
        },
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        navigate("/");
      }
      // Handle the response here
    } catch (error) {
      toast.error("Error");
      console.log(error);
      // Handle the error here
    }
  };

  return (
    <div className="flex  gap-2 ">
      <img src={SideImg} alt="sideImg" className=" w-1/2 h-screen" />
      <div className="flex flex-col items-center justify-center w-1/2 h-screen">
        <div className="w-2/3 h-fit rounded-xl p-4 flex flex-col items-center justify-center shadow-medium gap-4">
          <h1 className="text-2xl font-semibold text-left ">Sign Up</h1>
          <Input
            type="text"
            label="Name"
            value={name}
            onValueChange={setName}
          />
          <Input
            type="email"
            label="Email"
            value={email}
            onValueChange={setEmail}
          />
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
            Sign Up
          </Button>
          <div className="w-full relative border-b my-4">
            <h1 className="absolute px-4 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white text-gray-400">
              OR
            </h1>
          </div>

          <Googleauth />

          <div className="flex text-lg text-gray-600 hover:text-slate-500 cursor-pointer   flex-start justify-start" onClick={() => {
            navigate("/login")
          }}>
            Already have an account?
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

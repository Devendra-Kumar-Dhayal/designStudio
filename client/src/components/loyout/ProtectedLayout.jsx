import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import axios from "axios";
import Modal from "../Modal";

const ProtectedLayout = () => {
  const [isOpen, setisOpen] = useState(false);
  const navigate = useNavigate();

  const getUser = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/auth/user/me`, {
        withCredentials: true,
      });
      console.log(res.data.user, res.data.user.role);
      if (!res.data.user) navigate("/login");
      // if(use)
      if (!res.data.user.role) {
        setisOpen(true);
      }
    } catch (error) {
      console.log(error);
      navigate("/login");
    }
  };

  const handleRole = async (role) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/auth/user/role`,
        { role },
        {
          withCredentials: true,
        }
      );
      setisOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <Modal isOpen={isOpen} setIsOpen={setisOpen}>
        <div className="w-full h-full flex flex-col gap-4 p-8">
          <h1 className="w-full text-center text-2xl font-bold">
            Select User role To continue
          </h1>
          <div className="w-full gap-8 flex flex-row items-center justify-center">
            <div
              className="text-lg font-bold text-white cursor-pointer bg-blue-400 p-4 rounded-lg"
              onClick={() => {
                handleRole("designer");
              }}
            >
              Designer
            </div>
            <div
              className="text-lg font-bold text-white cursor-pointer bg-blue-400 p-4 rounded-lg"
              onClick={() => {
                handleRole("viewer");
              }}
            >
              Viewer
            </div>
          </div>
        </div>
      </Modal>
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
    </>
  );
};

export default ProtectedLayout;

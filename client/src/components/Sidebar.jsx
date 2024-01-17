/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import { MdDashboardCustomize } from "react-icons/md";
import { IconDesignStudio } from "../pages/Icons";


const Sidebar = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const menuItems = [
    {
      icon: MdDashboardCustomize,
      text: "Dashboard",
      path: "/",
    },
    {
      icon: MdDashboardCustomize,
      text: "Spaces",
      path: "/recents"
    }

  ];

  useEffect(() => {}, []);

  return (
    <>
      <nav className="box-border border-box h-full bg-inherit flex flex-col gap-7 w-[17vw]">
        <div className="flex flex-col pt-[30px] mb-6 px-10">
          
          <IconDesignStudio/>
          
        </div>

        <ul className="mx-auto w-4/5">
          {menuItems.map((item, index) => {
            const active = location.pathname === item.path;
            return (
              <li
                key={index}
                className={`w-full h-[65px] flex items-center gap-[11px] text-[#7C7C7C] font-bold cursor-pointer px-5 py-3 ${
                  active ? "bg-white rounded-xl shadow-md !text-black  " : ""
                } transition-transform transform-gpu `}
                onClick={() => {
                  navigate(item.path);
                }}
              >
                <div
                  className={`flex justify-center items-center rounded-xl bg-white w-[35px] h-[35px] ${
                    active ? "!bg-[#61D0F1]" : ""
                  }`}
                >
                  <item.icon
                    className={`w-[17px] h-[17px] ${
                      active ? "invert grayscale" : ""
                    } `}
                  />
                </div>
                <span className="text-[14px] tracking-wide">{item.text}</span>
              </li>
            );
          })}
        </ul>
        <div className="w-4/5 max-w-[251px] h-[190.5px] bg-[#47AFFF] gap-3 flex flex-col  mx-auto p-5  rounded-lg">
          {/* <img
            alt="icon"
            src={icon_img}
            className="w-[33px] h-[35px]  cursor-pointer"
          /> */}
          <div>
            <span className="text-[#ffffff] mt-3 block text-[14px]">
              Need Help?
            </span>
            <span className="text-[#ffffff] block text-[13px] ">
              Please check our docs
            </span>
          </div>
          <button
            className={`w-full h-[40px] self-center bg-white rounded-xl  cursor-pointer ${
              selectedItem === "documentation"
                ? "active:scale-95 transition-all duration-20 ease-in-out shadow-md"
                : ""
            }`}
            onClick={() => setSelectedItem("documentation")}
          >
            <span className="text-black text-[12px] font-semibold">
              DOCUMENTATION
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;

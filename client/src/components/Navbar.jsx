/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaQuestion } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

import { GiHamburgerMenu } from "react-icons/gi";
import { FaRegBell } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";

const Navbar = () => {
  const [search, setsearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  return (
    <div className="flex justify-between py-2 my-4 items-center">
      {/* <div className=" lg:hidden w-[17px] h-full flex items-center justify-center">
        <svg
          className="w-full h-full my-auto"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          ></path>
        </svg>
      </div> */}
      

      <div className="relative flex ml-2  rounded-full bg py-2 px-5 bg-[#D8EEFF] w-[56%] justify-between items-center">
        <FaSearch className="w-[17px] h-[17px]" />
        <input
          type="text"
          style={{
            padding: "0.5rem",
            backgroundColor: "inherit",
            width: "100%",
            border: "none",
            outline: "none",
            borderBottom: "none",
            boxShadow: "none",
          }}
          placeholder="Search"
          value={search}
          onChange={(e) => setsearch(e.target.value)}
        />
        <GiHamburgerMenu />

        {searchResult.length > 0 && (
          <div className="absolute bg-white p-3 w-11/12 min-h-[300px] max-h-[600px] rounded-lg shadow-lg overflow-y-scroll top-[115%] z-50 ">
            <div className="w-full h-full ">
              {searchResult.map((result, index) => (
                <div
                  className="w-full h-12 flex items-center justify-between border-b border-gray-200"
                  key={index}
                >
                  <p className="text-xs font-normal">{result.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        {/* <div className="flex items-center justify-center w-[40px] h-[40px] bg-white rounded-xl">
          <FaQuestion className="w-[24px] h-[24px]" alt="" />
        </div> */}
        {/* <div className="flex items-center justify-center w-[40px] h-[40px] bg-white rounded-xl">
          <FaRegBell className="w-[24px] h-[24px]" alt="" />
        </div> */}

        <RxAvatar alt="" className="w-[24px] h-[24px]" />

        <p className="text-lg font-normal hidden md:block">User Name</p>
      </div>
    </div>
  );
};

export default Navbar;

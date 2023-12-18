import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full flex flex-col gap-4 ">
      <h1 className="text-3xl font-medium text-black">Dashboard</h1>
      <div className="min-h-[238px]   max-w-[1213px] bg-white gap-9 p-7 flex flex-row rounded-2xl">
        {Array.from(Array(5)).map(() => {
          return (
            <div className="w-full h-[200px] bg-[#F8F9FA] p-3 rounded-xl flex flex-col justify-between shadow-md hover:bg-slate-100 cursor-pointer "
              onClick={() => {
                navigate("/workspace");
              }}
            >
              {" "}
              <div className="bg-white w-full h-[80%] rounded-lg   shadow-md"></div>
              Workspce
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;

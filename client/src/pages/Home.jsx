import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const [recents, setRecents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getRecents = async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/workspacesrecent`,
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) setRecents(res.data);
    };
    getRecents();
  }, []);

  const handleNew = async () => {

    const res = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}/api/workspaces`,
      null,
      {
        withCredentials: true,
      }
    );

    if (res.status === 200) navigate({
      pathname:"/workspace",
      search:`?wid=${res.data._id}`
    });
  };

  return (
    <div className="w-full flex flex-col gap-4 ">
      <h1 className="text-3xl font-medium text-black">Dashboard</h1>
      <div className="min-h-[238px]   max-w-[1213px] bg-white gap-9 p-7 flex flex-row rounded-2xl">
        {Array.from(Array(1)).map((_,index) => {
          return (
            <div
              className="w-[160px] h-[200px] bg-[#F8F9FA] p-3 rounded-xl flex flex-col justify-between shadow-md hover:bg-slate-100 cursor-pointer "
              onClick={handleNew}
            >
              {" "}
              <div className="bg-white w-full h-[80%] rounded-lg   shadow-md"></div>
              Template {index+1}
            </div>
          );
        })}
      </div>
      <div></div>
      <h1 className="text-3xl font-medium text-black">Recents</h1>
      <div className="min-h-[238px]   max-w-[1213px] bg-white gap-9 p-7 flex flex-col rounded-2xl">
        {recents.map((recent) => {
          return (
            <div
              className="w-full h-[50px] bg-[#F8F9FA] p-3 rounded-xl flex flex-col justify-between shadow-md hover:bg-slate-100 cursor-pointer "
              onClick={() => {
                navigate({
                  pathname: "/workspace",
                  search: `?wid=${recent._id}`,
                });
              }}
            >
              {" "}
              Workspace
            </div>
          );
        })}

        <div
          className="w-full h-[50px] bg-[#68BBE3] p-3 rounded-xl flex flex-col justify-between shadow-md hover:bg-slate-100 cursor-pointer "
          onClick={() => {
            navigate("/recents");
          }}
        >
          {" "}
          More Designs
        </div>
      </div>
    </div>
  );
};

export default Home;

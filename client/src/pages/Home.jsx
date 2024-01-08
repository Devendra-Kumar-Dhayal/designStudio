import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";

const SammpleObject = {
  label: "",
  description: "",
  owner: "",
};
const Home = () => {
  const [recents, setRecents] = useState([]);
  const [meta, setMeta] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [key, setkey] = useState("");
  const [value, setValue] = useState("");

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
  console.log("meta",meta)

  const handleNew = async () => {
    setMeta({ common: { ...SammpleObject } });
    setIsOpen(true);
  };

  const handleSave = async () => {
    // const elementsCopy = [...elements];

    // elementsCopy[selectedIdFormeta] = {
    //   ...elementsCopy[selectedIdFormeta],
    //   options: {
    //     ...elementsCopy[selectedIdFormeta].options,
    //     meta,
    //   },
    // };
    // setElements(elementsCopy, true);
    const res = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}/api/workspaces`,
      { meta },
      {
        withCredentials: true,
      }
    );

    if (res.status === 200)
      navigate({
        pathname: "/workspace",
        search: `?wid=${res.data._id}`,
      });
  };

  return (
    <div className="w-full flex flex-col gap-4 ">
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        classes={"p-4 flex flex-col gap-4"}
      >
        <div className="w-full rounded-lg border border-gray-400 flex flex-col gap-2 shadow-sm py-4 px-6">
          <h1 className="text-base font-bold">Add</h1>
          <div className="flex flex-col gap-4">
            {meta.common &&
              Object.entries(meta?.common).map(([key, value]) => (
                <div className="w-full flex gap-2">
                  <h2 className="text-white bg-slate-600 p-2 w-1/5 rounded-lg border-white outline-2 outline-slate-600">
                    {key.toUpperCase()}:
                  </h2>
                  <input
                    value={value}
                    placeholder={`${key}`}
                    onChange={(e) => {
                      setMeta((prevState) => ({
                        ...prevState,
                        common: {
                          ...prevState.common,
                          [key]: e.target.value,
                        },
                      }));
                    }}
                    className="w-4/5 p-5 bg-gray-300  rounded-lg"
                  />
                </div>
              ))}
          </div>
          <div className="flex flex-row gap-4">
            <input
              type="text"
              placeholder="Key"
              className="w-1/3 rounded-lg border border-gray-400 p-4"
              value={key}
              onChange={(e) => setkey(e.target.value)}
            />
            <input
              type="text"
              placeholder="Value"
              className="w-2/3 rounded-lg border border-gray-400 p-4"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white rounded-lg p-2"
              onClick={() => {
                setMeta((prevState) => ({
                  ...prevState,
                  other: {
                    [key]: value,
                  },
                }));
                setkey("");
                setValue("");
              }}
            >
              Add
            </button>
          </div>
        </div>
        {meta.other &&
          Object.entries(meta?.other).map(([key, value]) => (
            <div className="w-full flex gap-2">
              <h2 className="text-white bg-slate-600 p-2 w-1/5 rounded-lg border-white outline-2 outline-slate-600">
                {key}
              </h2>
              <p className="w-4/5 bg-gray-300 p-2 rounded-lg">{value}</p>
            </div>
          ))}

        <div className="flex flex-row gap-3">
          <button
            onClick={handleSave}
            className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg"
          >
            Save
          </button>
        </div>
      </Modal>
      <h1 className="text-3xl font-medium text-black">Dashboard</h1>
      <div className="min-h-[238px]   max-w-[1213px] bg-white gap-9 p-7 flex flex-row rounded-2xl">
        {Array.from(Array(1)).map((_, index) => {
          return (
            <div
              className="w-[160px] h-[200px] bg-[#F8F9FA] p-3 rounded-xl flex flex-col justify-between shadow-md hover:bg-slate-100 cursor-pointer "
              onClick={handleNew}
              key={index}
            >
              {" "}
              <div className="bg-white w-full h-[80%] rounded-lg shadow-md"></div>
              Template {index + 1}
            </div>
          );
        })}
      </div>
      <div></div>
      <h1 className="text-3xl font-medium text-black">Recents</h1>
      <div className="min-h-[238px]   max-w-[1213px] bg-white gap-9 p-7 flex flex-col rounded-2xl">
        {recents.map((recent, index) => {
          return (
            <div
              className="w-full h-[50px] bg-[#F8F9FA] p-3 rounded-xl flex flex-col justify-between shadow-md hover:bg-slate-100 cursor-pointer "
              onClick={() => {
                navigate({
                  pathname: "/workspace",
                  search: `?wid=${recent._id}`,
                });
              }}
              key={index}
            >
              {" "}
              {recent.meta.common.label}
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

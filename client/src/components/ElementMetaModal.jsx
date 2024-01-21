import { Button, Input, Modal, ModalContent } from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { BASEURL } from "../utils/functions";
import useDebounce from "./hooks/useDebounce";

const ElementMetaModal = ({
  meta,
  setMeta,
  isOpen,
  onOpenChange,
  handleDiscard,
  handleSave,
  handleLabelSave,
  selectedProjectId,
  wid,
  element,
  handleColorTypeUpdate,
  isDesigner,
}) => {
  const [name, setName] = useState("");
  const [key, setkey] = useState("");
  const [value, setValue] = useState("");
  const debouncedString = useDebounce(name, 500);
  const [isLoading, setIsLoading] = useState(false);

  const [show, setShow] = useState(false);
  const [toShow, setToShow] = useState({});

  console.log(element, element?.roughElement?.options?.fill);

  useEffect(() => {
    getName();
  }, [debouncedString]);
  const getName = async () => {
    try {
      const res = await axios.get(
        `${BASEURL}/api/projectelement/?projectId=${selectedProjectId}&name=${debouncedString}`,
        {
          withCredentials: true,
        }
      );
      // console.log(res.data);
      if (res.data === "OK") {
        setShow(false);
      } else {
        setShow(true);
        setToShow(res.data);
      }
      // setName(res.data.name)
    } catch (error) {
      console.log(error);
    }
  };

  const handleNameCreate = async () => {
    try {
      const res = await axios.post(
        `${BASEURL}/api/projectelement`,
        {
          projectId: selectedProjectId,
          name: debouncedString,
          workspaces: [{ workspaceId: wid }],
          type: element.type,
          color: element.roughElement.options.fill,
        },
        {
          withCredentials: true,
        }
      );
      if (res.status === 404) {
      }
      console.log(res);
      setMeta((prevState) => ({
        ...prevState,
        common: {
          ...prevState.common,
          label: res.data.name,
        },
      }));
      setName("");
      setIsLoading(false);
      handleLabelSave(res.data.name);
    } catch (error) {
      console.log(error.response.data);
      toast.error(error.response.data);
    }
  };

  const handleNameAdd = async () => {
    const bool = toShow.workspaces.some((w) => w.workspaceId.includes(wid));
    if (bool) {
      toast.error("Two elements in same workspace cannot have same name");
      return;
    }
    let currentWorkspaces = toShow.workspaces;
    currentWorkspaces.push({ workspaceId: wid });

    const res = await axios.put(
      `${BASEURL}/api/projectelement`,
      {
        projectId: selectedProjectId,
        name: toShow.name,
        workspaces: currentWorkspaces,
      },
      {
        withCredentials: true,
      }
    );
    console.log(res);
    if (res.status === 200) {
      setMeta((prevState) => ({
        ...prevState,
        common: {
          ...prevState.common,
          label: toShow.name,
        },
      }));
      setName("");
      setIsLoading(false);
      handleColorTypeUpdate(
        element,
        res.data.color,
        res.data.type,
        toShow.name
      );
    }
  };
  const obj = {
    description: meta?.common?.description,
    owner: meta?.common?.owner,
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="5xl"
      // classes={"p-4 flex flex-col gap-4"}
    >
      <ModalContent>
        <div className="w-full rounded-lg border border-gray-400 flex flex-col gap-2 shadow-sm py-4 px-6">
          <h1 className="text-base font-bold">Add</h1>
          <div className="flex flex-col gap-4">
            <div className="w-full flex gap-2 relative">
              <h2 className="text-white bg-slate-600 p-2 w-1/5 rounded-lg border-white outline-2 outline-slate-600">
                Name:
              </h2>
              <div className="w-48 p-2 bg-gray-200 justify-center items-center rounded-lg">
                {meta?.common?.label ?? ""}
              </div>

              {isDesigner && (
                <>
                  <Input
                    value={name}
                    onValueChange={setName}
                    type="text"
                    label="Name"
                  />
                  {
                    <div
                      className={`${
                        !show && "hidden"
                      } absolute   z-50 bg-gray-500 shadow-lg opacity-90 px-2.5 py-1 rounded-lg  transition-all   !duration-1000 delay-300 outline-none  translate-y-[60px] w-[60%] left-[17%]`}
                      // ref={ref}
                    >
                      <div className="px-1 py-2 overflow-scroll max-h-[300px] flex flex-col">
                        {toShow && (
                          <div
                            className="flex text-xs flex-col gap-2"
                            onClick={handleNameAdd}
                          >
                            <div className="flex flex-row gap-1">
                              <div className="w-1/5 bg-gray-400 rounded-lg p-1  ">
                                Name:
                              </div>
                              <div className="w-4/5  py-1">{toShow.name}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  }
                  <Button
                    color="primary"
                    className="my-auto"
                    onPress={handleNameCreate}
                    isLoading={isLoading}
                  >
                    Create
                  </Button>
                </>
              )}
            </div>
            {meta.common &&
              Object.entries(obj).map(([key, value]) => (
                <div className="w-full flex gap-2">
                  <h2 className="text-white bg-slate-600 p-2 w-1/5 rounded-lg border-white outline-2 outline-slate-600">
                    {key.toUpperCase()}:
                  </h2>

                  {isDesigner ? (
                    <input
                      value={value}
                      placeholder={`${key}`}
                      onChange={(e) => {
                        // if (!isDesigner) return;
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
                  ) : (
                    <div className="w-48 p-2 bg-gray-200 justify-center items-center rounded-lg">
                      {value ?? ""}
                    </div>
                  )}
                </div>
              ))}
          </div>
          {isDesigner && (
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
                      ...prevState.other,
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
          )}
          <h1>Meta</h1>
          <div className="flex flex-row gap-4">
            {meta.other &&
              Object.entries(meta?.other).map(([key, value]) => (
                <div className="w-full flex gap-2">
                  <h2 className="text-white bg-slate-600 p-2 w-1/5 rounded-lg border-white outline-2 outline-slate-600">
                    {key}
                  </h2>
                  <p className="w-4/5 bg-gray-300 p-2 rounded-lg">{value}</p>
                </div>
              ))}
          </div>
        </div>

        {isDesigner && (
          <div className="flex flex-row gap-3 p-4">
            <button
              onClick={handleSave}
              className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg"
            >
              Save
            </button>
            <button
              onClick={handleDiscard}
              className="p-2 bg-red-500 hover:bg-red-600 rounded-lg"
            >
              Discard
            </button>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ElementMetaModal;

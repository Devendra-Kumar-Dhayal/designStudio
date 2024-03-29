/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaQuestion } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { Cookies, remove } from "react-cookie";

import {
  Button,
  Select,
  SelectItem,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  NavbarMenu,
  NavbarMenuItem,
  Avatar,
  ScrollShadow,
} from "@nextui-org/react";

import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

import { GiHamburgerMenu } from "react-icons/gi";
import { FaRegBell } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import { ProjectContext } from "./ProjectContext";
import axios from "axios";
import { BASEURL } from "../utils/functions";
import { set } from "lodash";
import { toast } from "sonner";
import { SearchIcon } from "./SearchIcon";

const Navbarr = ({ user }) => {
  const [search, setsearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const { selectedProjectId, setSelectedProjectId } =
    useContext(ProjectContext);
  console.log("user", user);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const navigate = useNavigate();
  const cookies = new Cookies();

  const selected = selectedProjectId ? [selectedProjectId] : [];

  useEffect(() => {
    getAllProjects();
  }, []);

  useEffect(() => {
    searchHandler();
  }, [search]);

  const getAllProjects = async () => {
    try {
      const res = await axios.get(`${BASEURL}/api/project`, {
        withCredentials: true,
      });
      setProjects(res.data.projects);
    } catch (error) {
      console.log(error);
    }
  };
  const searchHandler = async () => {
    // e.preventDefault()
    if (!search) {
      setSearchResult([]);
      return;
    }
    const resp = await axios.get(
      `${BASEURL}/api/workspacesearch/?workspace=${search}`,
      {
        withCredentials: true,
      }
    );
    // console.log(resp.data);
    setSearchResult(resp.data);
    // console.log(search)
  };
  const handleCreateNewProject = async (onClose) => {
    try {
      const res = await axios.post(
        `${BASEURL}/api/project`,
        {
          name,
        },
        {
          withCredentials: true,
        }
      );
      console.log("resp", res);
      if (res.status === 201) {
        setProjects([...projects, res.data]);
        setSelectedProjectId(res.data._id);
        setName("");

        onClose();
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const handleLogout = async () => {
    const resp = await axios.get(`${BASEURL}/api/logout`, {
      withCredentials: true,
    });
    if (resp.status === 200) {
      toast.success("Logout succesfull");
      navigate("/login");
    }

    //
  };

  console.log(searchResult);
  return (
    <div className="flex justify-between py-2 my-4 items-center">
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create Project
              </ModalHeader>
              <ModalBody>
                <Input
                  value={name}
                  onValueChange={setName}
                  type="text"
                  label="Name"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={() => handleCreateNewProject(onClose)}
                >
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Select
        variant="faded"
        placeholder="Select a project"
        className="max-w-[250px]"
        selectedKeys={[...selected]}
      >
        {projects?.map((project) => (
          <SelectItem
            key={project._id}
            onClick={() => setSelectedProjectId(project._id)}
          >
            {project.name}
          </SelectItem>
        ))}
        <SelectItem key={"add"}>
          <Button className="w-full  flex flex-row gap-2" onClick={onOpen}>
            <IoMdAdd />
            Add New
          </Button>
        </SelectItem>
      </Select>
      <div className="relative flex ml-2  rounded-full  w-[56%] justify-between items-center">
        {/* <FaSearch className="w-[17px] h-[17px]" /> */}
        <Input
          label="Search"
          isClearable
          radius="lg"
          value={search}
          onValueChange={setsearch}
          classNames={{
            label: "text-black/50 dark:text-white/90",
            input: [
              "bg-transparent rounded-2xl",
              "text-black/90 dark:text-white/90",
              "placeholder:text-default-700/50 dark:placeholder:text-white/60 ",
            ],
            innerWrapper: "bg-transparent",
            inputWrapper: [
              "shadow-xl",
              "bg-default-200/50",
              "dark:bg-default/60",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "hover:bg-default-200/70",
              "dark:hover:bg-default/70",
              "group-data-[focused=true]:bg-default-200/50",
              "dark:group-data-[focused=true]:bg-default/60",
              "!cursor-text",
            ],
          }}
          placeholder="Type to search..."
          startContent={
            <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
          }
        />
        {/* <GiHamburgerMenu /> */}

        {searchResult.length > 0 && (
          <ScrollShadow className="absolute bg-white p-3 w-11/12  max-h-[600px] rounded-lg shadow-lg  top-[115%] z-50 ">
            <div className="w-full h-full ">
              {searchResult.map((result, index) => (
                <div
                  className="w-full h-12 p-2 rounded-md flex items-center justify-between border-b border-gray-200 hover:bg-gray-300"
                  key={index}
                  onClick={() => {
                    navigate({
                      pathname: "/workspace",
                      search: `?wid=${result._id}`,
                    });
                  }}
                >
                  <p className="text-xs font-normal">
                    {result?.meta?.common?.label}
                  </p>
                </div>
              ))}
            </div>
          </ScrollShadow>
        )}
      </div>

      <Dropdown>
        <DropdownTrigger>
          <Button variant="bordered">
            {/* <Avatar
              isBordered
              as="button"
              className="transition-transform"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            /> */}
            <p className="text-lg font-normal hidden md:block">{user?.name}</p>
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem key="new">
            <Button variant="bordered" onPress={handleLogout}>
              Logout
            </Button>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default Navbarr;

import React, { useEffect, useState } from "react";

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
} from "@nextui-org/react";
import axios from "axios";
import { BASEURL } from "../utils/functions";
import { useNavigate } from "react-router-dom";
import { TbClipboardData } from "react-icons/tb";
import { toast } from "sonner";

const Admin = () => {
  const [data, setdata] = useState([]);
  const navigate = useNavigate();
  const [count, setcount] = useState(0);

  useEffect(() => {
    getUser();
  }, [count]);

  const getUser = async () => {
    try {
      const user = await axios.get(`${BASEURL}/api/auth/user/me`, {
        withCredentials: true,
      });

      if (user.status === 403) {
        navigate("/login");
        toast.error("Bad Request");
        return; // Exit the function here
      } else if (!user.data.user.role || user.data.user.role !== "admin") {
        navigate("/");
        toast.error("Bad Request");
        return; // Exit the function here
      }

      const resp = await axios.get(`${BASEURL}/api/getRoleUser`, {
        withCredentials: true,
      });

      if (resp.status === 200) {
        setdata(resp.data.users);
      }
    } catch (error) {
      // This block will handle other errors
      navigate("/login");
    }
  };

  const handleButton = async (data, role) => {
    try {
      const resp = await axios.put(
        `${BASEURL}/api/getRoleUser`,
        {
          userId: data._id,
          role,
        },
        {
          withCredentials: true,
        }
      );

      if (resp.status === 403) {
        navigate("/login");
        toast.error("Bad Request");
        return; // Exit the function here
      }
      if (resp.status === 200) {
        setcount((prev) => prev + 1);
      }
    } catch (error) {
      // This block will handle other errors
      toast.error("error");
      // navigate("/login");
    }
  };

  return (
    <div className="w-screen h-screen px-5 mt-10 flex flex-col gap-5">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <Table aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>NAME</TableColumn>
          <TableColumn>EMAIL</TableColumn>
          <TableColumn>ROLE</TableColumn>
          <TableColumn>VIEWER</TableColumn>
          <TableColumn>DESIGNER</TableColumn>
          <TableColumn>ADMIN</TableColumn>
        </TableHeader>
        <TableBody>
          {data.map((data) => (
            <TableRow>
              <TableCell>{data._id}</TableCell>
              <TableCell>{data.name}</TableCell>
              <TableCell>{data.email}</TableCell>
              <TableCell>{data.role}</TableCell>
              <TableCell>
                <Button
                  onPress={() => {
                    handleButton(data, "viewer");
                  }}
                >
                  VIEWER
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  onPress={() => {
                    handleButton(data, "designer");
                  }}
                >
                  DESIGNER
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  onPress={() => {
                    handleButton(data, "admin");
                  }}
                >
                  ADMIN
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Admin;

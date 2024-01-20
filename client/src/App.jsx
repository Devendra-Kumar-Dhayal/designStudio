import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedLayout from "./components/loyout/ProtectedLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Recents from "./pages/Recents";
import Submit from "./pages/Submit";
import WorkSpace from "./pages/WorkSpace";
import { Toaster, toast } from "sonner";
import Project from "./pages/Project";
import ReadmeViewer from "./pages/ReadmeViewer";

const App = () => {
  return (
    <div className="w-screen min-h-screen  ">
      <Toaster />
      <Routes>
        <Route element={<ProtectedLayout />}>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/recents" element={<Recents />} />
          <Route exact path="/submit" element={<Submit />} />
        </Route>
        <Route exact path="/workspace" element={<WorkSpace />} />
        <Route exact path="/workspaceView" element={<Project />} />
        <Route exact path="/project" element={<Project />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/docs" element={<ReadmeViewer />} />
      </Routes>
    </div>
  );
};

export default App;

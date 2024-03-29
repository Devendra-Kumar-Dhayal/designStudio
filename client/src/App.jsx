import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedLayout from "./components/loyout/ProtectedLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Verify from "./pages/Verify";
import Forgot from "./pages/Forgot";
import Change from "./pages/Change";
import Register from "./pages/Register";
import Recents from "./pages/Recents";
import Submit from "./pages/Submit";
import WorkSpace from "./pages/WorkSpace";
import { Toaster, toast } from "sonner";
import Project from "./pages/Project";
import ReadmeViewer from "./pages/ReadmeViewer";
import Admin from "./pages/Admin";

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
        <Route exact path="/forgot" element={<Forgot />} />
        <Route exact path="/verify" element={<Verify />} />
        <Route exact path="/change" element={<Change />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/admin" element={<Admin />} />
        <Route exact path="/docs" element={<ReadmeViewer />} />
      </Routes>
    </div>
  );
};

export default App;

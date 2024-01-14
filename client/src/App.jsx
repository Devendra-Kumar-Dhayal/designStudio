import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedLayout from "./components/loyout/ProtectedLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Recents from "./pages/Recents";
import WorkSpace from "./pages/WorkSpace";


const App = () => {
  return (
    <div className="w-screen min-h-screen  ">
      <Routes>
        <Route element={<ProtectedLayout />}>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/recents" element = {<Recents/>} />
        </Route>
        <Route exact path="/workspace" element={<WorkSpace />} />
        <Route exact path="/login" element={<Login/>} />
      </Routes>
    </div>
  );
};

export default App;

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import WorkSpace from "./pages/WorkSpace";
import ProtectedLayout from "./components/loyout/ProtectedLayout";
import Home from "./pages/Home";
import Recents from "./pages/Recents";
import Login from "./pages/Login";
import axios from "axios";


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
        {/* <Route element={<LoginLayout />}>
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/forgot" element={<ForgotPassword />} />
      </Route> */}
      </Routes>
    </div>
  );
};

export default App;

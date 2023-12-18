import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import WorkSpace from "./pages/WorkSpace";
import ProtectedLayout from "./components/loyout/ProtectedLayout";
import Home from "./components/loyout/Home";

const App = () => {
  return (
    <div className="w-screen min-h-screen  ">
      <Routes>
        <Route element={<ProtectedLayout />}>
          <Route exact path="/" element={<Home />} />
        </Route>
        <Route exact path="/workspace" element={<WorkSpace />} />
        {/* <Route element={<LoginLayout />}>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/forgot" element={<ForgotPassword />} />
      </Route> */}
      </Routes>
    </div>
  );
};

export default App;

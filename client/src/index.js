import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import ProjectContextProvider from "./components/ProjectContext";
import { NextUIProvider } from "@nextui-org/react";
import { CookiesProvider } from "react-cookie";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <CookiesProvider defaultSetOptions>
    <NextUIProvider>
      <ProjectContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ProjectContextProvider>
    </NextUIProvider>
  </CookiesProvider>
);

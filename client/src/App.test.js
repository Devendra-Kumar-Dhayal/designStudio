import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

describe("App Routing Tests", () => {
  it("renders Home component for '/' route", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
  });

  it("renders Recents component for '/recents' route", () => {
    render(
      <MemoryRouter initialEntries={["/recents"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Recents/i)).toBeInTheDocument();
  });

  // More test cases for other routes...
});

describe("App Layout Tests", () => {
  it("renders ProtectedLayout for '/' route", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("protected-layout")).toBeInTheDocument();
  });

  it("does not render layout for '/workspace' route", () => {
    render(
      <MemoryRouter initialEntries={["/workspace"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.queryByTestId("protected-layout")).not.toBeInTheDocument();
  });

  // More layout test cases...
});

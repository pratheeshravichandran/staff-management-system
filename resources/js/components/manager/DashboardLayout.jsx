// components/DashboardLayout.jsx
import React from "react";
import Sidebar from "./Sidebar"; // make sure this is your sidebar component
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-grow p-6 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;

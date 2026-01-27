import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function Applayout() {
  return (
    <div className="d-flex min-vh-100 bg-black text-white">
      <Sidebar />

      <div className="flex-grow-1 p-4 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

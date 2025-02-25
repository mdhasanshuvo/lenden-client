import React, { useState, useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";
import {
  FiLogOut,
  FiMenu,
  FiX,
  FiUser,
  FiArrowLeftCircle,
  FiSettings,
} from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import { AiOutlineSend } from "react-icons/ai";
import { BiMoneyWithdraw } from "react-icons/bi";
import { BsCashCoin } from "react-icons/bs";
// import { Helmet } from "react-helmet";

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  // Example: user.accountType might be "Admin", "Agent", or "User"
  const role = user?.role || "User";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      navigate("/auth/login");
      await logout();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  /** 
   * Renders sidebar links depending on user role 
   */
  const renderLinks = () => {
    if (role === "Admin") {
      return (
        <>
          <Link
            to="/dashboard/admin-home"
            className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-indigo-600"
          >
            <MdDashboard size={20} />
            <span>Admin Home</span>
          </Link>
          <Link
            to="/dashboard/manage-users"
            className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-indigo-600"
          >
            <FiUser size={20} />
            <span>Manage Users</span>
          </Link>
          <Link
            to="/dashboard/manage-agents"
            className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-indigo-600"
          >
            <FiSettings size={20} />
            <span>Manage Agents</span>
          </Link>
          <Link
            to="/dashboard/admin-reports"
            className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-indigo-600"
          >
            <FiSettings size={20} />
            <span>Admin Reports</span>
          </Link>
        </>
      );
    } else if (role === "Agent") {
      return (
        <>
          <Link
            to="/dashboard/agent-home"
            className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-indigo-600"
          >
            <MdDashboard size={20} />
            <span>Agent Home</span>
          </Link>
          <Link
            to="/dashboard/cash-in-users"
            className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-indigo-600"
          >
            <BsCashCoin size={20} />
            <span>Cash-In (Users)</span>
          </Link>
          <Link
            to="/dashboard/agent-balance"
            className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-indigo-600"
          >
            <FiSettings size={20} />
            <span>Agent Balance</span>
          </Link>
        </>
      );
    } else {
      // Default: User
      return (
        <>
          <Link
            to="/dashboard/user-home"
            className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-indigo-600"
          >
            <MdDashboard size={20} />
            <span>My Home</span>
          </Link>
          <Link
            to="/dashboard/user/send-money"
            className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-indigo-600"
          >
            <AiOutlineSend size={20} />
            <span>Send Money</span>
          </Link>
          <Link
            to="/dashboard/cash-out"
            className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-indigo-600"
          >
            <BiMoneyWithdraw size={20} />
            <span>Cash Out</span>
          </Link>
          <Link
            to="/dashboard/add-money"
            className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-indigo-600"
          >
            <BsCashCoin size={20} />
            <span>Add Money</span>
          </Link>
        </>
      );
    }
  };

  return (
    <>
      {/* <Helmet>
        <title>LenDen Dashboard</title>
      </Helmet> */}

      {/* Mobile Top Bar */}
      <header className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 text-white flex items-center justify-between px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <button onClick={toggleSidebar}>
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          <h1 className="font-bold text-lg">LenDen</h1>
        </div>
        {/* Example: user info on top (mobile) */}
        <div className="flex items-center gap-2">
          <span className="font-semibold">{user?.name || "User"}</span>
        </div>
      </header>

      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 z-20 fixed md:static top-0 left-0 min-h-screen w-64 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 text-white transform transition-transform duration-300 flex flex-col`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-white/20 flex items-center justify-between md:justify-center">
            <div className="flex items-center gap-2">
              <FiArrowLeftCircle size={24} />
              <h2 className="text-2xl font-bold">LenDen</h2>
            </div>
            {/* Close button in mobile view */}
            <button
              className="md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Sidebar Nav Links */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {renderLinks()}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-white/20">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 w-full px-4 py-2 rounded-md transition"
            >
              <FiLogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between bg-white shadow px-6 py-4 ">
            <h1 className="text-xl font-bold text-gray-800">LenDen Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium">{user?.name || "User"}</span>
              <img
                src={user?.photoURL || "https://via.placeholder.com/40"}
                alt="Avatar"
                className="w-9 h-9 rounded-full object-cover border border-gray-300"
              />
            </div>
          </div>

          {/* Content (nested routes) */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;

import React, { useState, useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";
import {
  FiLogOut, FiMenu, FiX, FiUser, FiArrowLeftCircle, FiSettings,
} from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import { AiOutlineSend } from "react-icons/ai";
import { BiMoneyWithdraw } from "react-icons/bi";
import { BsCashCoin } from "react-icons/bs";
import { GrTransaction } from "react-icons/gr";
import Loading from "../pages/Loading";

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const role = user?.role;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  if (!user) {
    return <Loading />;
  }

  const handleLogout = async () => {
    try {
      navigate("/auth/login");
      await logout();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const renderLinks = () => {
    const commonClasses = "flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-indigo-600 transition";
    if (role === "Admin") {
      return (
        <>
          <Link to="/dashboard/admin-home" className={commonClasses}>
            <MdDashboard size={22} />
            <span>Admin Home</span>
          </Link>
          <Link to="/dashboard/admin/manage-users" className={commonClasses}>
            <FiUser size={22} />
            <span>Manage Users</span>
          </Link>
          <Link to="/dashboard/admin/manage-agents" className={commonClasses}>
            <FiSettings size={22} />
            <span>Manage Agents</span>
          </Link>
          <Link to="/dashboard/admin/agent-approvals" className={commonClasses}>
            <FiSettings size={22} />
            <span>Agent Approvals</span>
          </Link>
          <Link to="/dashboard/admin/agent-requests" className={commonClasses}>
            <FiSettings size={22} />
            <span>Cash Requests</span>
          </Link>
          <Link to="/dashboard/admin/agent-Withdraw-requests" className={commonClasses}>
            <FiSettings size={22} />
            <span>Withdraw Requests</span>
          </Link>
        </>
      );
    } else if (role === "Agent") {
      return (
        <>
          <Link to="/dashboard/agent-home" className={commonClasses}>
            <MdDashboard size={22} />
            <span>Agent Home</span>
          </Link>
          <Link to="/dashboard/agent/cash-in-users" className={commonClasses}>
            <BsCashCoin size={22} />
            <span>Cash-In Users</span>
          </Link>
          <Link to="/dashboard/agent/cash-request" className={commonClasses}>
            <BsCashCoin size={22} />
            <span>Cash Request</span>
          </Link>
          <Link to="/dashboard/agent/withdraw-request" className={commonClasses}>
            <BsCashCoin size={22} />
            <span>Withdraw Request</span>
          </Link>
          <Link to="/dashboard/agent/transactions" className={commonClasses}>
            <GrTransaction size={22} />
            <span>Transactions</span>
          </Link>
        </>
      );
    } else {
      return (
        <>
          <Link to="/dashboard/user-home" className={commonClasses}>
            <MdDashboard size={22} />
            <span>User Home</span>
          </Link>
          <Link to="/dashboard/user/send-money" className={commonClasses}>
            <AiOutlineSend size={22} />
            <span>Send Money</span>
          </Link>
          <Link to="/dashboard/user/cash-out" className={commonClasses}>
            <BiMoneyWithdraw size={22} />
            <span>Cash Out</span>
          </Link>
          <Link to="/dashboard/user/transactions" className={commonClasses}>
            <GrTransaction size={22} />
            <span>Transactions</span>
          </Link>
        </>
      );
    }
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <header className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 text-white flex items-center justify-between px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <button onClick={toggleSidebar}>
            {sidebarOpen ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>
          <h1 className="text-xl font-bold">LenDen</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">{user?.name || "User"}</span>
        </div>
      </header>

      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 z-30 fixed md:static top-0 left-0 w-64 min-h-screen bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 text-white flex flex-col transition-transform duration-300`}
        >
          {/* Sidebar Top */}
          <div className="p-5 flex items-center justify-between md:justify-center border-b border-white/20">
            <div className="flex items-center gap-2">
              <FiArrowLeftCircle size={26} />
              <h2 className="text-2xl font-bold">LenDen</h2>
            </div>
            <button onClick={toggleSidebar} className="md:hidden">
              <FiX size={26} />
            </button>
          </div>

          {/* Sidebar Links */}
          <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
            {renderLinks()}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/20">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white font-semibold transition"
            >
              <FiLogOut size={22} />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between bg-white shadow-md px-6 py-4">
            <h1 className="text-xl font-bold text-gray-800">LenDen Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-semibold">{user?.name || "User"}</span>
              <img
                src={user?.photoURL || "https://via.placeholder.com/40"}
                alt="User"
                className="w-10 h-10 rounded-full border border-gray-300 object-cover"
              />
            </div>
          </div>

          {/* Nested Pages */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;

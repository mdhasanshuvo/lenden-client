import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../provider/AuthProvider";
import { FiEyeOff, FiEye } from "react-icons/fi";
import { FaUsers, FaUserShield, FaUserCheck, FaMoneyBillWave, FaCogs, FaHandHoldingUsd } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import useAxios from "../Hook/useAxios";

const API_URL = "https://lenden-server-seven.vercel.app";

const AdminHome = () => {
  const { user } = useContext(AuthContext);
  const [adminIncome, setAdminIncome] = useState(0);
  const [totalSystemMoney, setTotalSystemMoney] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const axiosSecure = useAxios();

  // For recent users/agents
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentAgents, setRecentAgents] = useState([]);

  useEffect(() => {
    fetchSystemStats();
    fetchRecentUsers();
    fetchRecentAgents();
  }, []);

  const fetchSystemStats = async () => {
    try {
      const res = await axiosSecure.get(`/admin/system-stats`, { withCredentials: true });
      if (res.data.success) {
        setAdminIncome(res.data.adminIncome || 0);
        setTotalSystemMoney(res.data.totalSystemMoney || 0);
      }
    } catch (error) {
      console.error("AdminHome fetch stats error:", error);
    }
  };

  const fetchRecentUsers = async () => {
    try {
      // e.g. /admin/recent-users?limit=5
      const res = await axiosSecure.get(`/admin/recent-users?limit=5`, { withCredentials: true });
      if (res.data.success) {
        setRecentUsers(res.data.users || []);
      }
    } catch (error) {
      console.error("fetchRecentUsers error:", error);
    }
  };

  const fetchRecentAgents = async () => {
    try {
      // e.g. /admin/recent-agents?limit=5
      const res = await axiosSecure.get(`/admin/recent-agents?limit=5`, { withCredentials: true });
      if (res.data.success) {
        setRecentAgents(res.data.agents || []);
      }
    } catch (error) {
      console.error("fetchRecentAgents error:", error);
    }
  };

  const toggleStats = () => setShowStats(!showStats);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600">
      <motion.div
        className="bg-gradient-to-r from-indigo-400 to-indigo-600 text-white p-6 flex flex-col items-start rounded-b-2xl shadow-lg"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold">{user?.name || "Admin"}</h1>
        <div className="mt-2 flex items-center">
          <button
            onClick={toggleStats}
            className="bg-white text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-full font-semibold shadow-md  transition duration-300"
          >
            {showStats
              ? `Income: ৳${adminIncome.toFixed(2)} | System: ৳${totalSystemMoney.toFixed(2)}`
              : "Tap for Stats"}
          </button>
          <div className="ml-2">
            {showStats ? <FiEye size={22} /> : <FiEyeOff size={22} />}
          </div>
        </div>
      </motion.div>

      {/* Shortcut grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 p-6">
        <Link to="/dashboard/admin/manage-users" className="bg-white rounded-xl shadow-lg p-5 flex flex-col items-center hover:scale-105 transition-transform duration-300">
          <FaUsers className="text-indigo-500 mb-3" size={32} />
          <span className="text-base font-semibold text-gray-700">Manage Users</span>
        </Link>
        <Link to="/dashboard/admin/manage-agents" className="bg-white rounded-xl shadow-lg p-5 flex flex-col items-center hover:scale-105 transition-transform duration-300">
          <FaUserShield className="text-indigo-500 mb-3" size={32} />
          <span className="text-base font-semibold text-gray-700">Manage Agents</span>
        </Link>
        <Link to="/dashboard/admin/agent-approvals" className="bg-white rounded-xl shadow-lg p-5 flex flex-col items-center hover:scale-105 transition-transform duration-300">
          <FaUserCheck className="text-indigo-500 mb-3" size={32} />
          <span className="text-base font-semibold text-gray-700">Approvals</span>
        </Link>
        <Link to="/dashboard/admin/agent-requests" className="bg-white rounded-xl shadow-lg p-5 flex flex-col items-center hover:scale-105 transition-transform duration-300">
          <FaMoneyBillWave className="text-indigo-500 mb-3" size={32} />
          <span className="text-base font-semibold text-gray-700">Cash Requests</span>
        </Link>
        <Link to="/dashboard/admin/agent-withdraw-requests" className="bg-white rounded-xl shadow-lg p-5 flex flex-col items-center hover:scale-105 transition-transform duration-300">
          <FaHandHoldingUsd className="text-indigo-500 mb-3" size={32} />
          <span className="text-base font-semibold text-gray-700">Withdraw Req</span>
        </Link>
        <Link to="/dashboard/admin/admin-settings" className="bg-white rounded-xl shadow-lg p-5 flex flex-col items-center hover:scale-105 transition-transform duration-300">
          <FaCogs className="text-indigo-500 mb-3" size={32} />
          <span className="text-base font-semibold text-gray-700">Settings</span>
        </Link>
      </div>

      {/* Recent users & agents */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Users</h2>
          {recentUsers.length === 0 ? (
            <p className="text-gray-500">No recent users</p>
          ) : (
            <ul className="space-y-2">
              {recentUsers.map((u) => (
                <li key={u._id} className="text-sm text-gray-700 border-b pb-2">
                  {u.name} - {u.mobileNumber}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 text-right">
            <Link to="/dashboard/admin/manage-users" className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold">
              Show All Users
            </Link>
          </div>
        </div>

        {/* Recent Agents */}
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Agents</h2>
          {recentAgents.length === 0 ? (
            <p className="text-gray-500">No recent agents</p>
          ) : (
            <ul className="space-y-2">
              {recentAgents.map((a) => (
                <li key={a._id} className="text-sm text-gray-700 border-b pb-2">
                  {a.name} - {a.mobileNumber}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 text-right">
            <Link to="/dashboard/admin/manage-agents" className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold">
              Show All Agents
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

};

export default AdminHome;

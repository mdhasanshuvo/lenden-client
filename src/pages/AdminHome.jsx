import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../provider/AuthProvider";
import { FiEyeOff, FiEye } from "react-icons/fi";
import { FaUsers, FaUserShield, FaUserCheck, FaMoneyBillWave, FaCogs, FaHandHoldingUsd } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const API_URL = "http://localhost:5000";

const AdminHome = () => {
  const { user } = useContext(AuthContext);
  const [adminIncome, setAdminIncome] = useState(0);
  const [totalSystemMoney, setTotalSystemMoney] = useState(0);
  const [showStats, setShowStats] = useState(false);

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
      const res = await axios.get(`${API_URL}/admin/system-stats`, { withCredentials: true });
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
      const res = await axios.get(`${API_URL}/admin/recent-users?limit=5`, { withCredentials: true });
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
      const res = await axios.get(`${API_URL}/admin/recent-agents?limit=5`, { withCredentials: true });
      if (res.data.success) {
        setRecentAgents(res.data.agents || []);
      }
    } catch (error) {
      console.error("fetchRecentAgents error:", error);
    }
  };

  const toggleStats = () => setShowStats(!showStats);

  return (
    <div className="min-h-screen bg-gray-100">
      <motion.div 
        className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-4 flex flex-col items-start"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-xl font-bold">{user?.name || "Admin"}</h1>
        <div className="mt-2 flex items-center">
          <button
            onClick={toggleStats}
            className="bg-white text-pink-600 px-3 py-1 rounded-full font-medium mr-2 focus:outline-none"
          >
            {showStats
              ? `Income: ৳${adminIncome.toFixed(2)} | System: ৳${totalSystemMoney.toFixed(2)}`
              : "Tap for Stats"}
          </button>
          {showStats ? <FiEye size={20} /> : <FiEyeOff size={20} />}
        </div>
      </motion.div>

      {/* Shortcut grid */}
      <div className="grid grid-cols-3 gap-4 p-4">
        <Link to="/dashboard/admin/manage-users" className="bg-white shadow-md p-3 rounded-lg flex flex-col items-center hover:shadow-lg">
          <FaUsers className="text-pink-500 mb-2" size={28} />
          <span className="text-sm font-semibold text-gray-700">Manage Users</span>
        </Link>
        <Link to="/dashboard/admin/manage-agents" className="bg-white shadow-md p-3 rounded-lg flex flex-col items-center hover:shadow-lg">
          <FaUserShield className="text-pink-500 mb-2" size={28} />
          <span className="text-sm font-semibold text-gray-700">Manage Agents</span>
        </Link>
        <Link to="/dashboard/admin/agent-approvals" className="bg-white shadow-md p-3 rounded-lg flex flex-col items-center hover:shadow-lg">
          <FaUserCheck className="text-pink-500 mb-2" size={28} />
          <span className="text-sm font-semibold text-gray-700">Approvals</span>
        </Link>
        <Link to="/dashboard/admin/agent-requests" className="bg-white shadow-md p-3 rounded-lg flex flex-col items-center hover:shadow-lg">
          <FaMoneyBillWave className="text-pink-500 mb-2" size={28} />
          <span className="text-sm font-semibold text-gray-700">Cash Requests</span>
        </Link>
        <Link to="/dashboard/admin/agent-withdraw-requests" className="bg-white shadow-md p-3 rounded-lg flex flex-col items-center hover:shadow-lg">
          <FaHandHoldingUsd className="text-pink-500 mb-2" size={28} />
          <span className="text-sm font-semibold text-gray-700">Withdraw Req</span>
        </Link>
        <Link to="/dashboard/admin/admin-settings" className="bg-white shadow-md p-3 rounded-lg flex flex-col items-center hover:shadow-lg">
          <FaCogs className="text-pink-500 mb-2" size={28} />
          <span className="text-sm font-semibold text-gray-700">Settings</span>
        </Link>
      </div>

      {/* Recent users & agents */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Recent Users */}
          <div className="bg-white rounded-lg shadow p-3">
            <h2 className="text-md font-bold text-gray-800 mb-2">Recent Users</h2>
            {recentUsers.length === 0 ? (
              <p className="text-gray-500">No recent users</p>
            ) : (
              <ul className="space-y-1">
                {recentUsers.map((u) => (
                  <li key={u._id} className="text-sm text-gray-700 border-b pb-1">
                    {u.name} - {u.mobileNumber}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-2 text-right">
              <Link to="/dashboard/admin/manage-users" className="text-pink-600 hover:underline text-sm">
                Show All Users
              </Link>
            </div>
          </div>

          {/* Recent Agents */}
          <div className="bg-white rounded-lg shadow p-3">
            <h2 className="text-md font-bold text-gray-800 mb-2">Recent Agents</h2>
            {recentAgents.length === 0 ? (
              <p className="text-gray-500">No recent agents</p>
            ) : (
              <ul className="space-y-1">
                {recentAgents.map((a) => (
                  <li key={a._id} className="text-sm text-gray-700 border-b pb-1">
                    {a.name} - {a.mobileNumber}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-2 text-right">
              <Link to="/dashboard/admin/manage-agents" className="text-pink-600 hover:underline text-sm">
                Show All Agents
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;

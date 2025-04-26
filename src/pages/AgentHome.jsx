import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../provider/AuthProvider";
import { FiEyeOff, FiEye } from "react-icons/fi";
import { FaUserPlus, FaMoneyCheck, FaHandHoldingUsd } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import useAxios from "../Hook/useAxios";

const AgentHome = () => {
  const { user } = useContext(AuthContext);
  const [agentIncome, setAgentIncome] = useState(0);
  const [showIncome, setShowIncome] = useState(false);
  const [recentTx, setRecentTx] = useState([]);

  useEffect(() => {
    fetchAgentProfile();
    fetchTransactions();
  }, []);

  const axiosSecure = useAxios();

  const fetchAgentProfile = async () => {
    try {
      const res = await axiosSecure.get('/profile', { withCredentials: true });
      if (res.data.success && res.data.user.agentIncome !== undefined) {
        setAgentIncome(res.data.user.agentIncome);
      }
    } catch (error) {
      console.error("AgentHome fetch error:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      // For agent: /transactions?agentId=<AGENT_ID>&limit=5
      if (!user?._id) return;
      const res = await axiosSecure.get(
        `/transactions?agentId=${user._id}&limit=5`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setRecentTx(res.data.transactions || []);
      }
    } catch (err) {
      console.error("AgentHome fetchTx error:", err);
    }
  };

  const toggleIncome = () => setShowIncome(!showIncome);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600">
      <motion.div
        className="bg-gradient-to-r from-indigo-400 to-indigo-600 text-white p-6 flex flex-col items-start"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold">{user?.name || "Agent Name"}</h1>
        <div className="mt-2 flex items-center">
          <button
            onClick={toggleIncome}
            className="bg-white text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-full font-medium mr-2 shadow-md transition duration-300"
          >
            {showIncome ? `Income: ৳${agentIncome.toFixed(2)}` : "Tap for Income"}
          </button>
          {showIncome ? <FiEye size={20} /> : <FiEyeOff size={20} />}
        </div>
      </motion.div>

      {/* Shortcut grid */}
      <div className="grid grid-cols-3 gap-6 p-6">
        <Link
          to="/dashboard/agent/cash-in-users"
          className="bg-white shadow-lg p-5 rounded-xl flex flex-col items-center hover:shadow-2xl transition duration-300"
        >
          <FaUserPlus className="text-indigo-500 mb-3" size={28} />
          <span className="text-lg font-semibold text-gray-700">Cash-In (User)</span>
        </Link>
        <Link
          to="/dashboard/agent/cash-request"
          className="bg-white shadow-lg p-5 rounded-xl flex flex-col items-center hover:shadow-2xl transition duration-300"
        >
          <FaMoneyCheck className="text-indigo-500 mb-3" size={28} />
          <span className="text-lg font-semibold text-gray-700">Request Cash</span>
        </Link>
        <Link
          to="/dashboard/agent/withdraw-request"
          className="bg-white shadow-lg p-5 rounded-xl flex flex-col items-center hover:shadow-2xl transition duration-300"
        >
          <FaHandHoldingUsd className="text-indigo-500 mb-3" size={28} />
          <span className="text-lg font-semibold text-gray-700">Withdraw</span>
        </Link>
      </div>

      {/* Recent Transactions */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Transactions</h2>
        <div className="bg-white rounded-xl shadow-lg p-6">
          {recentTx.length === 0 ? (
            <p className="text-gray-500">No recent transactions</p>
          ) : (
            <ul className="space-y-4">
              {recentTx.map((tx) => (
                <li key={tx._id} className="border-b pb-4">
                  <p className="font-semibold">TX ID: {tx.transactionId}</p>
                  <p className="text-lg text-gray-600">
                    {tx.type} | Amount: ৳{tx.amount}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(tx.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 text-right">
            <Link to="/dashboard/agent/Transactions" className="text-indigo-600 hover:text-indigo-800 hover:underline">
              Show All Transactions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

};

export default AgentHome;

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../provider/AuthProvider";
import { FiEyeOff, FiEye } from "react-icons/fi";
import { FaMoneyBillWave, FaMoneyCheckAlt, FaPlusSquare } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MdPayment } from "react-icons/md";
import useAxios from "../Hook/useAxios";

const API_URL = "https://lenden-server-seven.vercel.app";

const UserHome = () => {
  const { user } = useContext(AuthContext);
  const [balance, setBalance] = useState(0);
  const [showBalance, setShowBalance] = useState(false);
  const [recentTx, setRecentTx] = useState([]);
  const axiosSecure = useAxios();

  useEffect(() => {
    fetchProfile();
    fetchTransactions();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/profile`, { withCredentials: true });
      if (res.data.success) {
        setBalance(res.data.user.balance || 0);
      }
    } catch (err) {
      console.error("UserHome fetchProfile error:", err);
    }
  };

  const fetchTransactions = async () => {
    try {
      // If your user object has _id
      // e.g. GET /transactions?userId=<USER_ID>&limit=5
      if (!user?._id) return;
      const res = await axiosSecure.get(
        `/transactions?userId=${user._id}&limit=5`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setRecentTx(res.data.transactions || []);
      }
    } catch (err) {
      console.error("UserHome fetchTx error:", err);
    }
  };

  const toggleBalance = () => setShowBalance(!showBalance);

  return (
    <div className="min-h-screen bg-gray-100">
      <motion.div
        className="bg-gradient-to-r from-indigo-400 to-indigo-600 text-white p-4 flex flex-col items-start"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-xl font-bold">{user?.name || "User Name"}</h1>
        <div className="mt-2 flex items-center">
          <button
            onClick={toggleBalance}
            className="bg-white text-blue-600 px-3 py-1 rounded-full font-medium mr-2"
          >
            {showBalance ? `৳${balance.toFixed(2)}` : "Tap for Balance"}
          </button>
          {showBalance ? <FiEye size={20} /> : <FiEyeOff size={20} />}
        </div>
      </motion.div>

      {/* Shortcut grid */}
      <div className="grid grid-cols-3 gap-4 p-4">
        <Link
          to="/dashboard/user/send-money"
          className="bg-white shadow-md p-3 rounded-lg flex flex-col items-center hover:shadow-lg"
        >
          <FaMoneyBillWave className="text-blue-500 mb-2" size={28} />
          <span className="text-sm font-semibold text-gray-700">Send Money</span>
        </Link>
        <Link
          to="/dashboard/user/cash-out"
          className="bg-white shadow-md p-3 rounded-lg flex flex-col items-center hover:shadow-lg"
        >
          <FaMoneyCheckAlt className="text-blue-500 mb-2" size={28} />
          <span className="text-sm font-semibold text-gray-700">Cash Out</span>
        </Link>
        <Link
          to="/dashboard/add-money"
          className="bg-white shadow-md p-3 rounded-lg flex flex-col items-center hover:shadow-lg"
        >
          <MdPayment className="text-blue-500 mb-2" size={28} />
          <span className="text-sm font-semibold text-gray-700">Payment (Beta)</span>
        </Link>
      </div>

      {/* Recent Transactions */}
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-2">
          Recent Transactions
        </h2>
        <div className="bg-white rounded-lg shadow p-3">
          {recentTx.length === 0 ? (
            <p className="text-gray-500">No recent transactions</p>
          ) : (
            <ul className="space-y-2">
              {recentTx.map((tx) => (
                <li key={tx._id} className="border-b pb-2">
                  <p className="font-semibold">TX ID: {tx.transactionId}</p>
                  <p className="text-sm text-gray-600">
                    {tx.type} | Amount: ৳{tx.amount}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(tx.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-3 text-right">
            <Link to="/dashboard/user/Transactions" className="text-blue-600 hover:underline">
              Show All Transactions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../provider/AuthProvider";
import { motion } from "framer-motion";
import { FaExchangeAlt } from "react-icons/fa"; 
import useAxios from "../Hook/useAxios";
// Example icon for transaction

const API_URL = "https://lenden-server-seven.vercel.app";

const UserTransactions = () => {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxios();

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  const fetchAllTransactions = async () => {
    try {
      setLoading(true);
      // if user?._id, pass userId plus limit=100
      const res = await axiosSecure.get(
        `/transactions?userId=${user?._id}&limit=100`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setTransactions(res.data.transactions || []);
      }
    } catch (err) {
      console.error("fetchAllTransactions error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-100 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        My Transactions (Last 100)
      </h2>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : transactions.length === 0 ? (
        <p className="text-gray-600">No transactions found.</p>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx._id} className="bg-white p-3 rounded shadow flex items-center">
              <FaExchangeAlt className="text-pink-500 mr-3" size={24} />
              <div>
                <p className="font-semibold">TX ID: {tx.transactionId}</p>
                <p className="text-sm text-gray-600">{tx.type} | Amount: ৳{tx.amount}</p>
                <p className="text-xs text-gray-400">
                  {new Date(tx.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default UserTransactions;

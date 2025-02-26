import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../provider/AuthProvider";
import useAxios from "../Hook/useAxios";

const API_URL = "http://localhost:5000"; // or your actual server URL

const WithdrawRequest = () => {
  const { user } = useContext(AuthContext); // the logged-in agent
  const [agentIncome, setAgentIncome] = useState(0);
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const axiosSecure = useAxios();

  useEffect(() => {
    // Optionally fetch agent profile on mount to show agentIncome
    fetchAgentProfile();
  }, []);

  const fetchAgentProfile = async () => {
    try {
      // If your /profile returns { user: { agentIncome } }
      const res = await axios.get(`${API_URL}/profile`, { withCredentials: true });
      if (res.data.success && res.data.user) {
        // Assuming agentIncome is stored in user.agentIncome
        setAgentIncome(res.data.user.agentIncome || 0);
      }
    } catch (error) {
      console.error("Error fetching agent profile:", error);
    }
  };

  const handleRequest = async () => {
    const numericAmount = Number(amount) || 0;
    if (numericAmount <= 0) {
      Swal.fire("Error", "Please enter a valid amount.", "error");
      return;
    }
    if (numericAmount > agentIncome) {
      Swal.fire("Error", "You cannot withdraw more than your agent income.", "error");
      return;
    }

    try {
      const res = await axiosSecure.post(
        `/agents/withdraw-request`,
        { amount: numericAmount, reason },
        { withCredentials: true }
      );
      if (res.data.success) {
        Swal.fire("Success", "Your withdrawal request has been submitted.", "success");
        setAmount("");
        setReason("");
      } else {
        Swal.fire("Error", res.data.message, "error");
      }
    } catch (error) {
      console.error("Withdraw request error:", error);
      Swal.fire("Error", error.response?.data?.message || error.message, "error");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Withdraw Request</h2>
      <div className="bg-white rounded shadow p-4">
        <p className="mb-2">
          Current Agent Income: <span className="font-semibold">৳{agentIncome}</span>
        </p>
        <label className="block text-gray-700 mb-1">Withdraw Amount</label>
        <input
          type="number"
          className="w-full border rounded-md p-2 mb-4 outline-none focus:border-pink-500"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <label className="block text-gray-700 mb-1">Reason (optional)</label>
        <textarea
          rows={3}
          className="w-full border rounded-md p-2 mb-4 outline-none focus:border-pink-500"
          placeholder="e.g. want to withdraw agent commission..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <button
          onClick={handleRequest}
          className="btn bg-pink-600 hover:bg-pink-700 text-white w-full py-2 rounded-md font-semibold"
        >
          Submit Withdraw Request
        </button>
      </div>
    </div>
  );
};

export default WithdrawRequest;

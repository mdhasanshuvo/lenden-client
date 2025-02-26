import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../provider/AuthProvider";
import useAxios from "../Hook/useAxios";

const API_URL = "http://localhost:5000";

const RequestCash = () => {
  const { user } = useContext(AuthContext); // user should be an agent
  const [balance, setBalance] = useState(0);
  const [reason, setReason] = useState("");
  const axiosSecure = useAxios();

  useEffect(() => {
    // Optionally fetch current agent profile to show their latest balance
    fetchAgentProfile();
  }, []);

  const fetchAgentProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/profile`, { withCredentials: true });
      if (res.data.success && res.data.user) {
        setBalance(res.data.user.balance || 0);
      }
    } catch (error) {
      console.error("Error fetching agent profile:", error);
    }
  };

  const handleRequest = async () => {
    try {
      // We assume each request is for a fixed 100,000 Taka
      const res = await axiosSecure.post(
        `/agents/cash-request`,
        {
          amount: 100000,
          reason
        },
        { withCredentials: true }
      );
      if (res.data.success) {
        Swal.fire("Request Sent", "Your request for 100,000 Taka has been submitted to admin.", "success");
        setReason("");
      } else {
        Swal.fire("Error", res.data.message, "error");
      }
    } catch (error) {
      console.error("Cash request error:", error);
      Swal.fire("Error", error.response?.data?.message || error.message, "error");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Request Additional Balance</h2>
      <div className="bg-white rounded shadow p-4">
        <p className="mb-2">Your Current Balance: <span className="font-semibold">৳{balance}</span></p>
        <p className="mb-4 text-gray-500">You can request an additional 100,000 Taka from the admin.</p>

        {/* Reason (optional) */}
        <label className="block text-gray-700 mb-1">Reason (optional)</label>
        <textarea
          className="w-full border rounded-md p-2 mb-4 outline-none focus:border-pink-500"
          rows={3}
          placeholder="e.g. Need more e-balance to serve more users..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <button
          onClick={handleRequest}
          className="btn bg-pink-600 hover:bg-pink-700 text-white w-full py-2 rounded-md font-semibold"
        >
          Request 100,000 Taka
        </button>
      </div>
    </div>
  );
};

export default RequestCash;

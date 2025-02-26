import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import useAxios from "../Hook/useAxios";

const API_URL = "http://localhost:5000";

const ManageAgentWithdrawRequests = () => {
  const [requests, setRequests] = useState([]);
  const axiosSecure = useAxios();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axiosSecure.get(`/admin/agent-withdraw-requests?status=pending`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setRequests(res.data.requests);
      }
    } catch (error) {
      console.error("Error fetching withdraw requests:", error);
    }
  };

  const handleApprove = async (requestId,amount) => {
    try {
      const res = await axiosSecure.patch(
        `/admin/agent-withdraw-requests/${requestId}/approve`,
        {amount},
        { withCredentials: true }
      );
      if (res.data.success) {
        Swal.fire("Approved", "Agent withdraw request approved!", "success");
        fetchRequests();
      } else {
        Swal.fire("Error", res.data.message, "error");
      }
    } catch (error) {
      console.error("Approve error:", error);
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleReject = async (requestId) => {
    try {
      const res = await axiosSecure.patch(
        `/admin/agent-withdraw-requests/${requestId}/reject`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        Swal.fire("Rejected", "Agent withdraw request rejected", "success");
        fetchRequests();
      } else {
        Swal.fire("Error", res.data.message, "error");
      }
    } catch (error) {
      console.error("Reject error:", error);
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Agent Withdraw Requests</h2>
      <div className="bg-white rounded shadow p-4">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Agent ID</th>
              <th>Amount</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id}>
                <td>{req.agentId}</td>
                <td>৳{req.amount}</td>
                <td>{req.reason || "N/A"}</td>
                <td>{req.status}</td>
                <td className="space-x-2">
                  <button
                    className="btn btn-sm bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleApprove(req._id,req.amount)}
                    
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-sm bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => handleReject(req._id)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-4">
                  No pending withdraw requests
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageAgentWithdrawRequests;

import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const API_URL = "http://localhost:5000";

const ManageAgentRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      // GET /admin/agent-cash-requests?status=pending
      const res = await axios.get(`${API_URL}/admin/agent-cash-requests?status=pending`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setRequests(res.data.requests);
      }
    } catch (error) {
      console.error("Error fetching agent requests:", error);
    }
  };

  // Approve request
  const handleApprove = async (requestId) => {
    try {
      const res = await axios.patch(
        `${API_URL}/admin/agent-cash-requests/${requestId}/approve`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        Swal.fire("Approved", "Agent’s request approved successfully!", "success");
        fetchRequests(); // refresh the list
      } else {
        Swal.fire("Error", res.data.message, "error");
      }
    } catch (error) {
      console.error("Approve error:", error);
      Swal.fire("Error", error.message, "error");
    }
  };

  // Reject request
  const handleReject = async (requestId) => {
    try {
      // or DELETE if you prefer. This example uses PATCH to set status=rejected
      const res = await axios.patch(
        `${API_URL}/admin/agent-cash-requests/${requestId}/reject`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        Swal.fire("Rejected", "Agent’s request was rejected.", "success");
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
    <div className="p-4 max-w-4xl mx-auto bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Agent Cash Requests</h2>
      <div className="bg-white rounded shadow p-4">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Agent ID</th>
              <th>Requested Amount</th>
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
                    className="btn btn-sm bg-green-600 text-white hover:bg-green-700"
                    onClick={() => handleApprove(req._id)}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-sm bg-red-600 text-white hover:bg-red-700"
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
                  No pending requests
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageAgentRequests;

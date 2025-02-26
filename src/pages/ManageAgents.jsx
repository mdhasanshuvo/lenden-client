import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import useAxios from "../Hook/useAxios";

const API_URL = "http://localhost:5000";

const ManageAgents = () => {
  const [agents, setAgents] = useState([]);
  const [search, setSearch] = useState("");
  const [showTxModal, setShowTxModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  
  const axiosSecure = useAxios();

  useEffect(() => {
    fetchAgents();
  }, [search]);

  const fetchAgents = async () => {
    try {
      // call /admin/agents?search=...
      const res = await axiosSecure.get(`/admin/agents?search=${search}`, { withCredentials: true });
      if (res.data.success) {
        setAgents(res.data.agents);
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };

  const toggleBlock = async (agentId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      const res = await axiosSecure.patch(
        `/admin/agents/${agentId}/block`,
        { isBlocked: newStatus },
        { withCredentials: true }
      );
      if (res.data.success) {
        Swal.fire("Success", "Agent block status updated", "success");
        fetchAgents();
      } else {
        Swal.fire("Error", res.data.message, "error");
      }
    } catch (error) {
      console.error("Block/unblock agent error:", error);
      Swal.fire("Error", error.message, "error");
    }
  };

  const viewTransactions = async (agent) => {
    setSelectedAgent(agent);
    try {
      // fetch transactions by agent
      const res = await axiosSecure.get(`/transactions?agentId=${agent._id}`, { withCredentials: true });
      if (res.data.success) {
        setTransactions(res.data.transactions);
        setShowTxModal(true);
      }
    } catch (error) {
      console.error("Fetch agent tx error:", error);
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Agents</h2>

      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by phone"
          className="input input-bordered w-full max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Agents table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Balance</th>
              <th>Approved?</th>
              <th>Blocked?</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((ag) => (
              <tr key={ag._id}>
                <td>{ag.name}</td>
                <td>{ag.mobileNumber}</td>
                <td>৳{ag.balance || 0}</td>
                <td>{ag.isApproved ? "Yes" : "No"}</td>
                <td>{ag.isBlocked ? "Yes" : "No"}</td>
                <td className="space-x-2">
                  <button
                    className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() => viewTransactions(ag)}
                  >
                    View Tx
                  </button>
                  <button
                    className="btn btn-sm bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => toggleBlock(ag._id, ag.isBlocked)}
                  >
                    {ag.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
            {agents.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-gray-500">
                  No agents found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Transactions Modal */}
      {showTxModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-xl w-full max-w-xl relative">
            <button
              className="absolute top-2 right-2 text-gray-600"
              onClick={() => setShowTxModal(false)}
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-2">Transactions for {selectedAgent?.name}</h3>
            <div className="max-h-96 overflow-y-auto">
              {transactions.length > 0 ? (
                <ul className="space-y-2">
                  {transactions.map((tx) => (
                    <li key={tx._id} className="border p-2 rounded">
                      <p>TX ID: {tx.transactionId}</p>
                      <p>Type: {tx.type}</p>
                      <p>Amount: ৳{tx.amount}</p>
                      <p>Date: {new Date(tx.createdAt).toLocaleString()}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No transactions found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAgents;

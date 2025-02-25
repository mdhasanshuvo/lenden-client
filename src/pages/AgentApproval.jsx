import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const API_URL = "http://localhost:5000";

const AgentApproval = () => {
    const [agents, setAgents] = useState([]);

    useEffect(() => {
        fetchUnapprovedAgents();
    }, []);

    const fetchUnapprovedAgents = async () => {
        try {
            // GET /admin/agent-approvals => isApproved=false
            const res = await axios.get(`${API_URL}/admin/agent-approvals`, { withCredentials: true });
            if (res.data.success) {
                setAgents(res.data.agents);
            }
        } catch (error) {
            console.error("Error fetching unapproved agents:", error);
        }
    };

    const handleApprove = async (agentId) => {
        try {
            const res = await axios.patch(
                `${API_URL}/admin/agents/${agentId}/approve`,
                {},
                { withCredentials: true }
            );
            if (res.data.success) {
                Swal.fire("Success", "Agent approved successfully", "success");
                fetchUnapprovedAgents(); // refresh list
            } else {
                Swal.fire("Error", res.data.message, "error");
            }
        } catch (error) {
            console.error("Approve agent error:", error);
            Swal.fire("Error", error.message, "error");
        }
    };

    const handleReject = async (agentId) => {
        try {
            const res = await axios.delete(
                `${API_URL}/admin/agents/${agentId}/reject`,
                { withCredentials: true }
            );
            if (res.data.success) {
                Swal.fire("Success", "Agent rejected and removed", "success");
                fetchUnapprovedAgents();
            } else {
                Swal.fire("Error", res.data.message, "error");
            }
        } catch (error) {
            console.error("Reject agent error:", error);
            Swal.fire("Error", error.message, "error");
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Agent Approval Requests</h2>
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Balance</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {agents.map(agent => (
                            <tr key={agent._id}>
                                <td>{agent.name}</td>
                                <td>{agent.mobileNumber}</td>
                                <td>৳{agent.balance || 0}</td>
                                <td className="space-x-2">
                                    <button
                                        onClick={() => handleApprove(agent._id)}
                                        className="btn btn-sm bg-green-500 hover:bg-green-600 text-white"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(agent._id)}
                                        className="btn btn-sm bg-red-500 hover:bg-red-600 text-white"
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {agents.length === 0 && (
                            <tr>
                                <td colSpan="4" className="text-center text-gray-500 py-4">
                                    No agent approval requests found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AgentApproval;

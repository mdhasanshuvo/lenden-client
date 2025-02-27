import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../provider/AuthProvider";
import useAxios from "../Hook/useAxios";

const API_URL = "https://lenden-server-seven.vercel.app";

const ManageUsers = () => {
  
  const axiosSecure = useAxios();
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showTxModal, setShowTxModal] = useState(false);

  // 1) fetch users on mount, or whenever search changes
  useEffect(() => {
    fetchUsers();
  }, [search]);

  const fetchUsers = async () => {
    try {
      // call /admin/users?search=012345...
      const res = await axiosSecure.get(`/admin/users?search=${search}`, { withCredentials: true });
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // handle block/unblock
  const toggleBlock = async (userId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      const res = await axiosSecure.patch(
        `/admin/users/${userId}/block`,
        { isBlocked: newStatus },
        { withCredentials: true }
      );
      if (res.data.success) {
        Swal.fire("Success", "Block status updated", "success");
        // re-fetch users to reflect change
        fetchUsers();
      } else {
        Swal.fire("Error", res.data.message, "error");
      }
    } catch (error) {
      console.error("Block/unblock error:", error);
      Swal.fire("Error", error.message, "error");
    }
  };

  // show transactions
  const viewTransactions = async (usr) => {
    setSelectedUser(usr);
    try {
      const res = await axiosSecure.get(`/transactions?userId=${usr._id}`, { withCredentials: true });
      if (res.data.success) {
        setTransactions(res.data.transactions);
        setShowTxModal(true);
      }
    } catch (error) {
      console.error("Fetch tx error:", error);
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

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

      {/* Users table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Balance</th>
              <th>Blocked?</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((usr) => (
              <tr key={usr._id}>
                <td>{usr.name}</td>
                <td>{usr.mobileNumber}</td>
                <td>৳{usr.balance || 0}</td>
                <td>{usr.isBlocked ? "Yes" : "No"}</td>
                <td className="space-x-2">
                  <button
                    className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() => viewTransactions(usr)}
                  >
                    View Tx
                  </button>
                  <button
                    className="btn btn-sm bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => toggleBlock(usr._id, usr.isBlocked)}
                  >
                    {usr.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-gray-500">
                  No users found
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
            <h3 className="text-xl font-bold mb-2">Transactions for {selectedUser?.name}</h3>
            <div className="max-h-96 overflow-y-auto">
              {transactions.length > 0 ? (
                <ul className="space-y-2">
                  {transactions.map((tx) => (
                    <li key={tx._id} className="border p-2 rounded">
                      <p>TX ID: {tx.transactionId}</p>
                      <p>Type: {tx.type}</p>
                      <p>Amount: ৳{tx.amount}</p>
                      <p>Date: {new Date(tx.createdAt).toLocaleString()}</p>
                      {/* More fields as needed */}
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

export default ManageUsers;

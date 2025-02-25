import React from "react";

const AdminHome = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Dashboard</h2>
      <p className="text-gray-600">
        Welcome, Admin! From here you can manage Users, Agents, view Reports, and monitor the total system balance.
      </p>
    </div>
  );
};

export default AdminHome;

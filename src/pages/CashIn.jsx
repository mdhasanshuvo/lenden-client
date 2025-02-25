import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FiArrowLeft } from "react-icons/fi";
import { AiOutlineSearch } from "react-icons/ai";
import { BsFillLockFill } from "react-icons/bs";
import { AuthContext } from "../provider/AuthProvider";

const API_URL = "http://localhost:5000"; // Adjust to your backend

const CashIn = () => {
  const { user } = useContext(AuthContext);

  // Step 1 = select user, Step 2 = enter amount, Step 3 = confirm with agent PIN
  const [step, setStep] = useState(1);

  // List of users
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  // Form fields
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [reference, setReference] = useState("");

  // On mount, fetch user list (only if agent is logged in)
  useEffect(() => {
    // We assume your backend has an endpoint to get all users or specifically "accountType=User".
    axios
      .get(`${API_URL}/users?accountType=User`, { withCredentials: true })
      .then((res) => {
        if (res.data.success && res.data.users) {
          // We map them to something easy to display
          const mapped = res.data.users.map((u) => ({
            id: u._id,
            name: u.name,
            phone: u.mobileNumber,
          }));
          setUsers(mapped);
        }
      })
      .catch((error) => console.log("Fetch users error:", error));
  }, []);

  // Filter user list by search term
  const filteredUsers = users.filter(
    (usr) =>
      usr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usr.phone.includes(searchTerm)
  );

  // Step 1: select user
  const handleSelectUser = (usr) => {
    setSelectedUser(usr);
    setStep(2);
  };

  // Step 2: agent enters amount
  const handleProceed = () => {
    if (!amount || Number(amount) <= 0) {
      Swal.fire("Error", "Please enter a valid amount.", "error");
      return;
    }
    setStep(3);
  };

  // Step 3: confirm with agent PIN => call /transactions/cash-in
  const handleCashIn = async () => {
    if (!pin || pin.length < 5) {
      Swal.fire("Error", "Please enter a valid 5-digit PIN.", "error");
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/transactions/cash-in`,
        {
          userPhone: selectedUser.phone, 
          amount,
          pin, // agent’s PIN for security
          reference, // optional
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Cash-In Successful",
          text: `TX ID: ${res.data.transactionId}\nUser New Balance: ৳${res.data.userBalance}`
        });
        // reset
        setStep(1);
        setSelectedUser(null);
        setAmount("");
        setPin("");
        setReference("");
        setSearchTerm("");
      } else {
        Swal.fire("Error", res.data.message, "error");
      }
    } catch (error) {
      console.log("CashIn error:", error);
      Swal.fire("Error", error.response?.data?.message || error.message, "error");
    }
  };

  // Top bar "Back" button
  const handleGoBack = () => {
    if (step === 2) {
      setStep(1);
      setAmount("");
    } else if (step === 3) {
      setStep(2);
      setPin("");
    } else {
      // if step=1, maybe go to some other page
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-4 flex items-center">
        <button onClick={handleGoBack} className="mr-2">
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold">Cash In</h1>
      </div>

      <div className="flex-1 p-4 w-full max-w-md mx-auto">
        {/* STEP 1: SELECT USER */}
        {step === 1 && (
          <>
            <div className="bg-white p-3 rounded-xl shadow mb-4 flex items-center">
              <AiOutlineSearch size={20} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Enter user's name or number"
                className="flex-1 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="bg-white rounded-xl shadow p-3">
              <h2 className="text-gray-700 mb-2 font-semibold">All Users</h2>
              <ul className="space-y-2">
                {filteredUsers.map((usr) => (
                  <li
                    key={usr.id}
                    className="p-2 bg-gray-50 hover:bg-gray-100 cursor-pointer rounded-md flex flex-col"
                    onClick={() => handleSelectUser(usr)}
                  >
                    <span className="text-gray-800 font-medium">{usr.name}</span>
                    <span className="text-sm text-gray-500">{usr.phone}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* STEP 2: ENTER AMOUNT */}
        {step === 2 && selectedUser && (
          <div className="bg-white rounded-xl shadow p-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pink-400 text-white flex items-center justify-center font-semibold">
                {selectedUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-700">
                  {selectedUser.name}
                </p>
                <p className="text-sm text-gray-500">{selectedUser.phone}</p>
              </div>
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-500 font-bold">
                  ৳
                </span>
                <input
                  type="number"
                  className="w-full pl-7 pr-3 py-2 border rounded-md outline-none focus:border-pink-500"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            {/* Optional reference */}
            <div>
              <label className="block text-gray-600 mb-1">Reference (optional)</label>
              <input
                type="text"
                className="w-full border rounded-md outline-none focus:border-pink-500 px-3 py-2"
                placeholder="e.g. deposit from user"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                maxLength={50}
              />
            </div>

            <button
              onClick={handleProceed}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-md font-semibold"
            >
              Continue
            </button>
          </div>
        )}

        {/* STEP 3: CONFIRM & AGENT PIN */}
        {step === 3 && selectedUser && (
          <div className="bg-white rounded-xl shadow p-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pink-400 text-white flex items-center justify-center font-semibold">
                {selectedUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-700">{selectedUser.name}</p>
                <p className="text-sm text-gray-500">{selectedUser.phone}</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Amount:</p>
                <p className="font-semibold text-gray-800">
                  ৳{Number(amount).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fee:</p>
                <p className="font-semibold text-gray-800">৳0.00</p>
              </div>
            </div>

            {reference && (
              <div>
                <p className="text-sm text-gray-600">Reference:</p>
                <p className="text-gray-800">{reference}</p>
              </div>
            )}

            <div>
              <label className="block text-gray-600 mb-1">Agent PIN</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-500">
                  <BsFillLockFill />
                </span>
                <input
                  type="password"
                  className="w-full pl-9 pr-3 py-2 border rounded-md outline-none focus:border-pink-500"
                  placeholder="Enter your 5-digit PIN"
                  maxLength={5}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={handleCashIn}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-md font-semibold"
            >
              Confirm to Cash In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CashIn;

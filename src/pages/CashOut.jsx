import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FiArrowLeft } from "react-icons/fi";
import { AiOutlineSearch } from "react-icons/ai";
import { BsFillLockFill } from "react-icons/bs";
import { AuthContext } from "../provider/AuthProvider";
import useAxios from "../Hook/useAxios";

const API_URL = "https://lenden-server-seven.vercel.app"; // your server URL

const CashOut = () => {
  const { user } = useContext(AuthContext);
  
  const axiosSecure = useAxios();

  // Steps: 1 = select agent, 2 = enter amount, 3 = confirm + PIN
  const [step, setStep] = useState(1);

  // Agent list
  const [agents, setAgents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgent, setSelectedAgent] = useState(null);

  // Form fields
  const [balance, setBalance] = useState(0); // user’s current balance
  const [amount, setAmount] = useState("");
  const [fee, setFee] = useState(0);
  const [pin, setPin] = useState("");
  const [reference, setReference] = useState("");

  // On mount, fetch user’s profile (to get balance), and fetch "approved" agents
  useEffect(() => {
    // 1) Get user profile
    axios
      .get(`${API_URL}/profile`, { withCredentials: true })
      .then((res) => {
        if (res.data.success && res.data.user.balance !== undefined) {
          setBalance(res.data.user.balance);
        }
      })
      .catch((err) => console.log("Profile fetch error:", err));

    // 2) Fetch all approved agents
    // We'll assume you have /agents?isApproved=true or something like that.
    axiosSecure
      .get(`/agents?approved=true`, { withCredentials: true })
      .then((res) => {
        if (res.data.success && res.data.agents) {
          // Format for easy usage
          const mapped = res.data.agents.map((a) => ({
            id: a._id,
            name: a.name,
            phone: a.mobileNumber,
          }));
          setAgents(mapped);
        }
      })
      .catch((err) => console.log("Agents fetch error:", err));
  }, []);

  // Filter agent list by search term
  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.phone.includes(searchTerm)
  );

  // Step 1: user picks an agent
  const handleSelectAgent = (agent) => {
    setSelectedAgent(agent);
    setStep(2);
  };

  // Step 2: user enters amount => auto-calc 1.5% fee
  const computeFee = (amt) => {
    const num = Number(amt) || 0;
    // 1.5% of num
    return (num * 0.015).toFixed(2);
  };

  const handleAmountChange = (val) => {
    setAmount(val);
    setFee(computeFee(val));
  };

  const handleProceed = () => {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      Swal.fire("Error", "Please enter a valid amount.", "error");
      return;
    }
    if (numericAmount > balance) {
      Swal.fire("Error", "Insufficient balance for cash out.", "error");
      return;
    }
    setStep(3);
  };

  // Step 3: confirm + PIN
  const handleCashOut = async () => {
    if (!pin || pin.length < 5) {
      Swal.fire("Error", "Please enter a valid 5-digit PIN.", "error");
      return;
    }

    try {
      const res = await axiosSecure.post(
        `/transactions/cash-out`,
        {
          agentPhone: selectedAgent.phone,
          amount,
          pin,
          reference, // optional field if you like
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Cash-Out Successful",
          text: `TX ID: ${res.data.transactionId}\nYour New Balance: ৳${res.data.userBalance}`,
        });
        // reset form
        setStep(1);
        setSelectedAgent(null);
        setAmount("");
        setFee(0);
        setPin("");
        setReference("");
        setSearchTerm("");
        // update local user balance
        setBalance(res.data.userBalance);
      } else {
        Swal.fire("Error", res.data.message, "error");
      }
    } catch (error) {
      console.log("CashOut error:", error);
      Swal.fire("Error", error.response?.data?.message || error.message, "error");
    }
  };

  // Handle "back" button in top bar
  const handleGoBack = () => {
    if (step === 2) {
      // Go back to agent list
      setStep(1);
      setAmount("");
      setFee(0);
    } else if (step === 3) {
      // Go back to amount input
      setStep(2);
      setPin("");
    } else {
      // If step=1, maybe navigate away
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-4 flex items-center">
        <button onClick={handleGoBack} className="mr-2">
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold">Cash Out</h1>
      </div>

      <div className="flex-1 p-4 w-full max-w-md mx-auto">
        {/* STEP 1: SELECT AGENT */}
        {step === 1 && (
          <>
            <div className="bg-white p-3 rounded-xl shadow mb-4 flex items-center">
              <AiOutlineSearch size={20} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Enter Agent number or name"
                className="flex-1 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="bg-white rounded-xl shadow p-3">
              <h2 className="text-gray-700 mb-2 font-semibold">All Agents</h2>
              <ul className="space-y-2">
                {filteredAgents.map((agent) => (
                  <li
                    key={agent.id}
                    className="p-2 bg-gray-50 hover:bg-gray-100 cursor-pointer rounded-md flex flex-col"
                    onClick={() => handleSelectAgent(agent)}
                  >
                    <span className="text-gray-800 font-medium">
                      {agent.name}
                    </span>
                    <span className="text-sm text-gray-500">{agent.phone}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* STEP 2: ENTER AMOUNT */}
        {step === 2 && selectedAgent && (
          <div className="bg-white rounded-xl shadow p-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pink-400 text-white flex items-center justify-center font-semibold">
                {selectedAgent.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-700">
                  {selectedAgent.name}
                </p>
                <p className="text-sm text-gray-500">{selectedAgent.phone}</p>
              </div>
            </div>

            {/* Amount */}
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
                  onChange={(e) => handleAmountChange(e.target.value)}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Your Balance: ৳{balance.toFixed(2)}
              </p>
            </div>

            {/* Fee & total */}
            <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
              <div>
                <p className="text-sm text-gray-700">
                  Fee (1.5%): ৳{Number(fee).toFixed(2)}
                </p>
                <p className="text-sm text-gray-700">
                  Total: ৳{(Number(amount) + Number(fee)).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Reference (optional) */}
            <div>
              <label className="block text-gray-600 mb-1">Reference</label>
              <input
                type="text"
                className="w-full border rounded-md outline-none focus:border-pink-500 px-3 py-2"
                placeholder="e.g. personal expenses"
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

        {/* STEP 3: CONFIRM + PIN */}
        {step === 3 && selectedAgent && (
          <div className="bg-white rounded-xl shadow p-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pink-400 text-white flex items-center justify-center font-semibold">
                {selectedAgent.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-700">
                  {selectedAgent.name}
                </p>
                <p className="text-sm text-gray-500">{selectedAgent.phone}</p>
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
                <p className="text-sm text-gray-600">Fee (1.5%):</p>
                <p className="font-semibold text-gray-800">
                  + ৳{Number(fee).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total:</p>
                <p className="font-semibold text-gray-800">
                  ৳{(Number(amount) + Number(fee)).toFixed(2)}
                </p>
              </div>
            </div>

            {reference && (
              <div>
                <p className="text-sm text-gray-600">Reference:</p>
                <p className="text-gray-800">{reference}</p>
              </div>
            )}

            <div>
              <label className="block text-gray-600 mb-1">Confirm PIN</label>
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
              onClick={handleCashOut}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-md font-semibold"
            >
              Confirm to Cash Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CashOut;

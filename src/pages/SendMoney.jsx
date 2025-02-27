import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FiArrowLeft } from "react-icons/fi";
import { AiOutlineSearch } from "react-icons/ai";
import { BsFillLockFill } from "react-icons/bs";
import { AuthContext } from "../provider/AuthProvider"; // or wherever it is
import useAxios from "../Hook/useAxios";

const API_URL = "https://lenden-server-seven.vercel.app"; // Adjust to your backend

const SendMoney = () => {
    const { user } = useContext(AuthContext);

    // Steps
    const [step, setStep] = useState(1);

    // Instead of hard-coded contacts, fetch from DB
    const [contacts, setContacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Selected recipient
    const [selectedRecipient, setSelectedRecipient] = useState(null);

    // Balance & form fields
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState("");
    const [fee, setFee] = useState(5);
    const [reference, setReference] = useState("");
    const [pin, setPin] = useState("");

    const axiosSecure = useAxios();

    // On mount, fetch user’s balance & the list of all 'User' accounts
    useEffect(() => {
        axios
            .get(`${API_URL}/profile`, { withCredentials: true })
            .then((res) => {
                if (res.data.success && res.data.user.balance !== undefined) {
                    setBalance(res.data.user.balance);
                    console.log(balance)
                }
            })
            .catch((error) => console.log("Profile fetch error:", error));

        // fetch the user contacts who are accountType=User
        axiosSecure
            .get(`/users?accountType=User`, { withCredentials: true })
            .then((res) => {
                if (res.data.success && res.data.users) {
                    const mapped = res.data.users.map((u) => ({
                        id: u._id,
                        name: u.name,
                        phone: u.mobileNumber,
                    }));
                    setContacts(mapped);
                }
            })
            .catch((error) => {
                console.log("Contacts fetch error:", error);
            });
    }, []);

    // Filtered contacts
    const filteredContacts = contacts.filter(
        (contact) =>
            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.phone.includes(searchTerm)
    );

    // Compute fee if amount > 100
    const computeFee = (amt) => {
        if (amt > 100) return 5;
        return 0;
    };

    // Step 1 -> pick contact
    const handleSelectContact = (contact) => {
        setSelectedRecipient(contact);
        setStep(2);
    };

    // Step 2 -> user enters amount
    const handleAmountChange = (val) => {
        setAmount(val);
        const numVal = Number(val) || 0;
        setFee(computeFee(numVal));
    };

    const handleProceed = () => {
        if (!amount || Number(amount) < 50) {
            Swal.fire("Error", "Minimum amount is 50 Taka.", "error");
            return;
        }
        if (Number(amount) + fee > balance) {
            Swal.fire("Error", "Insufficient balance.", "error");
            return;
        }
        setStep(3);
    };

    // Step 3 -> confirm & send money
    const handleSendMoney = async () => {
        if (!pin || pin.length < 5) {
            Swal.fire("Error", "Please enter a valid 5-digit PIN.", "error");
            return;
        }

        try {
            const res = await axiosSecure.post(
                `/transactions/send-money`,
                {
                    recipientPhone: selectedRecipient.phone,
                    amount,
                    pin,
                    reference,
                },
                { withCredentials: true }
            );

            if (res.data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Transaction Successful",
                    text: `TX ID: ${res.data.transactionId}\nNew Balance: ৳${res.data.senderBalance}`,
                });
                // reset everything
                setStep(1);
                setSelectedRecipient(null);
                setAmount("");
                setFee(0);
                setReference("");
                setPin("");
                // update local balance
                setBalance(res.data.senderBalance);
                // clear search
                setSearchTerm("");
            } else {
                Swal.fire("Error", res.data.message, "error");
            }
        } catch (error) {
            console.log(error);
            Swal.fire("Error", error.response?.data?.message || error.message, "error");
        }
    };

    // For back button
    const handleGoBack = () => {
        if (step === 2) {
            setStep(1);
            setAmount("");
            setFee(0);
        } else if (step === 3) {
            setStep(2);
            setPin("");
        } else {
            // if step=1, maybe navigate back to a previous route
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* TOP BAR */}
            <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-4 flex items-center">
                <button onClick={handleGoBack} className="mr-2">
                    <FiArrowLeft size={24} />
                </button>
                <h1 className="text-lg font-bold">Send Money</h1>
            </div>

            <div className="flex-1 p-4 w-full max-w-md mx-auto">
                {/* STEP 1: SELECT RECIPIENT */}
                {step === 1 && (
                    <>
                        <div className="bg-white p-3 rounded-xl shadow mb-4 flex items-center">
                            <AiOutlineSearch size={20} className="text-gray-400 mr-2" />
                            <input
                                type="text"
                                placeholder="Enter name or number"
                                className="flex-1 outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="bg-white rounded-xl shadow p-3">
                            <h2 className="text-gray-700 mb-2 font-semibold">All Contacts</h2>
                            <ul className="space-y-2">
                                {filteredContacts.map((contact) => (
                                    <li
                                        key={contact.id}
                                        className="p-2 bg-gray-50 hover:bg-gray-100 cursor-pointer rounded-md flex flex-col"
                                        onClick={() => handleSelectContact(contact)}
                                    >
                                        <span className="text-gray-800 font-medium">
                                            {contact.name}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {contact.phone}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}

                {/* STEP 2: ENTER AMOUNT */}
                {step === 2 && selectedRecipient && (
                    <div className="bg-white rounded-xl shadow p-4 space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-pink-400 text-white flex items-center justify-center font-semibold">
                                {selectedRecipient.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-700">
                                    {selectedRecipient.name}
                                </p>
                                <p className="text-sm text-gray-500">{selectedRecipient.phone}</p>
                            </div>
                        </div>

                        {/* Amount Input */}
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

                        {/* Fee & Total */}
                        <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                            <div>
                                <p className="text-sm text-gray-700">Charge: ৳{fee.toFixed(2)}</p>
                                <p className="text-sm text-gray-700">
                                    Total: ৳{(Number(amount) + fee).toFixed(2)}
                                </p>
                            </div>
                        </div>

                        {/* Reference */}
                        <div>
                            <label className="block text-gray-600 mb-1">Reference</label>
                            <input
                                type="text"
                                className="w-full border rounded-md outline-none focus:border-pink-500 px-3 py-2"
                                placeholder="e.g. Gift, Bill share..."
                                value={reference}
                                maxLength={25}
                                onChange={(e) => setReference(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={handleProceed}
                            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-md font-semibold"
                        >
                            Proceed
                        </button>
                    </div>
                )}

                {/* STEP 3: CONFIRM & PIN */}
                {step === 3 && selectedRecipient && (
                    <div className="bg-white rounded-xl shadow p-4 space-y-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-pink-400 text-white flex items-center justify-center font-semibold">
                                {selectedRecipient.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-700">
                                    {selectedRecipient.name}
                                </p>
                                <p className="text-sm text-gray-500">{selectedRecipient.phone}</p>
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
                                <p className="text-sm text-gray-600">Charge:</p>
                                <p className="font-semibold text-gray-800">+ ৳{fee.toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total:</p>
                                <p className="font-semibold text-gray-800">
                                    ৳{(Number(amount) + fee).toFixed(2)}
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
                            onClick={handleSendMoney}
                            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-md font-semibold"
                        >
                            Confirm to Send
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SendMoney;

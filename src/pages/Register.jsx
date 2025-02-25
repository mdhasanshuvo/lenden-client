import { useContext, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { AuthContext } from '../provider/AuthProvider';

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const showErrorAlert = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const pin = e.target.pin.value;
    const mobileNumber = e.target.mobileNumber.value;
    const email = e.target.email.value;
    const accountType = e.target.accountType.value;
    const nid = e.target.nid.value;

    // 1) Some basic validations
    if (!/^\d{5}$/.test(pin)) {
      showErrorAlert('PIN must be a 5-digit number.');
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      showErrorAlert('Please enter a valid email address.');
      return;
    }
    if (!nid) {
      showErrorAlert('NID is required.');
      return;
    }

    try {
      // 2) Call the register function
      const responseData = await register(name, pin, email, mobileNumber, accountType, nid);

      // 3) If successful, navigate or do role-based logic
      if (responseData.success) {
        const role = responseData.user.accountType;
        if (role === 'Admin') {
          navigate('/dashboard/admin-home');
        } else if (role === 'Agent') {
          navigate('/dashboard/agent-home');
        } else {
          navigate('/dashboard/user-home');
        }
      } else {
        // If success is false, throw an error to catch below
        throw new Error(responseData.message || 'Registration failed');
      }
    } catch (err) {
      showErrorAlert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600">
      <div className="card bg-white w-full max-w-lg p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Register Your Account
        </h2>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">Your Name</label>
            <input 
              name="name"
              type="text"
              placeholder="Enter your name"
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* PIN */}
          <div className="mb-4">
            <label htmlFor="pin" className="block text-gray-700">5-Digit PIN</label>
            <input
              name="pin"
              type="text"
              placeholder="Enter your 5-digit PIN"
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Mobile Number */}
          <div className="mb-4">
            <label htmlFor="mobileNumber" className="block text-gray-700">Mobile Number</label>
            <input
              name="mobileNumber"
              type="text"
              placeholder="Enter your mobile number"
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* E-mail */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Account Type */}
          <div className="mb-4">
            <label htmlFor="accountType" className="block text-gray-700">Account Type</label>
            <select
              name="accountType"
              className="input input-bordered w-full"
              required
            >
              <option value="User">User</option>
              <option value="Agent">Agent</option>
              {/* If needed, you can add Admin here, or handle Admin creation in a special way */}
            </select>
          </div>

          {/* NID */}
          <div className="mb-4">
            <label htmlFor="nid" className="block text-gray-700">NID</label>
            <input
              name="nid"
              type="text"
              placeholder="Enter your NID"
              className="input input-bordered w-full"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="mt-6 text-center">
            <button 
              type="submit"
              className="btn bg-indigo-600 text-white w-full py-2 rounded-full hover:bg-indigo-700"
            >
              Register
            </button>
          </div>

          <p className="text-center mt-6 text-gray-600">
            Already Have An Account?{" "}
            <Link className="text-indigo-600 hover:text-indigo-800" to="/auth/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;

import { useContext, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { AuthContext } from '../provider/AuthProvider';

const Register = () => {
    const { register, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    // For showing error messages in a clean way
    const showErrorAlert = (message) => {
        setError(message);
        setTimeout(() => setError(null), 5000); // Clear the error after 5 seconds
    };

    // Handle Registration Form Submit
    const handleSubmit = (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const pin = e.target.pin.value;
        const mobileNumber = e.target.mobileNumber.value;
        const email = e.target.email.value;
        const accountType = e.target.accountType.value;
        const nid = e.target.nid.value;

        // Validation: PIN (should be 5 digits)
        if (!/^\d{5}$/.test(pin)) {
            showErrorAlert('PIN must be a 5-digit number.');
            return;
        }

        // Validation: Email format
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            showErrorAlert('Please enter a valid email address.');
            return;
        }

        // Validation: NID (should not be empty)
        if (!nid) {
            showErrorAlert('NID is required.');
            return;
        }

        console.log(name, pin, mobileNumber, email, accountType, nid);

        register(name, pin, email, mobileNumber, accountType, nid)
            // .then(result => {
            //     const user = result.user;
            //     setUser(user);

            //     // For now, simulate success
            //     Swal.fire({
            //         icon: 'success',
            //         title: 'Registered Successfully!',
            //         text: `Welcome to Lenden, ${name}!`,
            //         confirmButtonText: 'Continue',
            //     }).then(() => {
            //         navigate('/auth/login'); // Redirect to login after successful registration
            //     });
            // })
            // .catch(error => {
            //     showErrorAlert(error.message);
            // });
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600">
            <div className="card bg-white w-full max-w-lg p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-semibold text-center text-gray-800">Register Your Account</h2>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    {/* Name */}
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700">Your Name</label>
                        <input name="name" type="text" placeholder="Enter your name" className="input input-bordered w-full" required />
                    </div>

                    {/* PIN */}
                    <div className="mb-4">
                        <label htmlFor="pin" className="block text-gray-700">5-Digit PIN</label>
                        <input name="pin" type="text" placeholder="Enter your 5-digit PIN" className="input input-bordered w-full" required />
                    </div>

                    {/* Mobile Number */}
                    <div className="mb-4">
                        <label htmlFor="mobileNumber" className="block text-gray-700">Mobile Number</label>
                        <input name="mobileNumber" type="text" placeholder="Enter your mobile number" className="input input-bordered w-full" required />
                    </div>

                    {/* E-mail */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700">Email</label>
                        <input name="email" type="email" placeholder="Enter your email" className="input input-bordered w-full" required />
                    </div>

                    {/* Account Type */}
                    <div className="mb-4">
                        <label htmlFor="accountType" className="block text-gray-700">Account Type</label>
                        <select name="accountType" className="input input-bordered w-full" required>
                            <option value="User">User</option>
                            <option value="Agent">Agent</option>
                        </select>
                    </div>

                    {/* NID */}
                    <div className="mb-4">
                        <label htmlFor="nid" className="block text-gray-700">NID</label>
                        <input name="nid" type="text" placeholder="Enter your NID" className="input input-bordered w-full" required />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <div className="mt-6 text-center">
                        <button type="submit" className="btn bg-indigo-600 text-white w-full py-2 rounded-full hover:bg-indigo-700">
                            Register
                        </button>
                    </div>

                    <p className="text-center mt-6 text-gray-600">
                        Already Have An Account? <Link className="text-indigo-600 hover:text-indigo-800" to='/auth/login'>Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;

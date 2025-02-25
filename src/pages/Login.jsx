import { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { AuthContext } from '../provider/AuthProvider';

const Login = () => {
    const { login, setUser } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    // For showing error messages in a clean way
    const showErrorAlert = (message) => {
        setError(message);
        setTimeout(() => setError(null), 5000); // Clear the error after 5 seconds
    };

    // Handle Login Form Submit
    const handleSubmit = (e) => {
        e.preventDefault();
        const emailOrMobile = e.target.emailOrMobile.value;
        const pin = e.target.pin.value;

        console.log(emailOrMobile, pin);

        login(emailOrMobile, pin)
            // .then(result => {
            //     const user = result.user;
            //     setUser(user);

            //     Swal.fire({
            //         icon: 'success',
            //         title: 'Login Successful',
            //         text: 'Welcome back to Landan!',
            //         confirmButtonText: 'Continue',
            //     }).then(() => {
            //         navigate(location?.state ? location.state : '/');
            //     });
            // })
            // .catch(error => {
            //     showErrorAlert(error.message);
            // });
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600">
            <div className="card bg-white w-full max-w-lg p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-semibold text-center text-gray-800">Login to Your Account</h2>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    {/* Email or Mobile Number */}
                    <div className="mb-4">
                        <label htmlFor="emailOrMobile" className="block text-gray-700">Mobile Number / Email</label>
                        <input
                            name="emailOrMobile"
                            type="text"
                            placeholder="Enter your mobile number or email"
                            className="input input-bordered w-full"
                            required
                        />
                    </div>

                    {/* PIN */}
                    <div className="mb-4">
                        <label htmlFor="pin" className="block text-gray-700">PIN</label>
                        <input
                            name="pin"
                            type="password"
                            placeholder="Enter your 5-digit PIN"
                            className="input input-bordered w-full"
                            required
                        />
                        {/* <a className="label-text-alt link link-hover">
                            Forgot PIN?
                        </a> */}
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <div className="mt-6 text-center">
                        <button type="submit" className="btn bg-indigo-600 text-white w-full py-2 rounded-full hover:bg-indigo-700">
                            Login
                        </button>
                    </div>

                    <p className="text-center mt-6 text-gray-600">
                        Don’t Have An Account? <Link className="text-indigo-600 hover:text-indigo-800" to='/auth/register'>Register</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;

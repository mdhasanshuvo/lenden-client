import { useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
// import { FaGoogle } from "react-icons/fa"; // Google login can be uncommented later
// import { AuthContext } from '../provider/AuthProvider'; // Firebase integration placeholder
// import Swal from 'sweetalert2';
// import axios from 'axios';

const Login = () => {
    // const { signIn, setUser, googleAuth, setEmail } = useContext(AuthContext); // Firebase placeholder
    const location = useLocation();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    // For showing error messages in a clean way
    const showErrorAlert = (message) => {
        setError(message);
        setTimeout(() => setError(null), 5000); // Clear the error after 5 seconds
    };

    // Google login function (Placeholder for future integration)
    // const onClickForGoogle = () => {
    //     googleAuth()
    //         .then(result => {
    //             const userFromGoogle = result.user;
    //             console.log(userFromGoogle);
    //             setUser(userFromGoogle);
    //             // Add user to the database (future backend integration)
    //             axios.post('/your-backend-url/users', {
    //                 name: userFromGoogle.displayName,
    //                 email: userFromGoogle.email,
    //                 photo: userFromGoogle.photoURL,
    //             })
    //             .then(res => {
    //                 if (res.data.insertedId) {
    //                     Swal.fire({
    //                         icon: 'success',
    //                         title: 'Login Successful',
    //                         text: 'You have successfully logged in with Google!',
    //                     });
    //                     navigate(location?.state ? location.state : '/');
    //                 }
    //             })
    //             .catch(error => {
    //                 Swal.fire({
    //                     icon: 'error',
    //                     title: 'Database Error',
    //                     text: 'Failed to save user information. Please try again later.',
    //                 });
    //             });
    //         })
    //         .catch(error => {
    //             Swal.fire({
    //                 icon: 'error',
    //                 title: 'Login Failed',
    //                 text: 'Google login failed. Please try again later.',
    //             });
    //         });
    // };

    // Handle Login Form Submit
    const handleSubmit = (e) => {
        e.preventDefault();
        const emailOrMobile = e.target.emailOrMobile.value;
        const pin = e.target.pin.value;

        console.log(emailOrMobile, pin);

        // Firebase sign-in placeholder (for future Firebase integration)
        // signIn(emailOrMobile, pin)
        //     .then(result => {
        //         const user = result.user;
        //         setUser(user);
        //         // Show success message with SweetAlert
        //         Swal.fire({
        //             icon: 'success',
        //             title: 'Login Successful',
        //             text: 'You have successfully logged in!',
        //         });
        //         navigate(location?.state ? location.state : '/');
        //     })
        //     .catch(error => {
        //         Swal.fire({
        //             icon: 'error',
        //             title: 'Login Failed',
        //             text: 'Login failed! Please check your credentials and try again.',
        //         });
        //     });

        // For now, simulate successful login
        Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: 'Welcome back to Landan!',
            confirmButtonText: 'Continue',
        }).then(() => {
            navigate(location?.state ? location.state : '/');
        });
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
                        <a className="label-text-alt link link-hover">
                            Forgot PIN?
                        </a>
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

                    {/* Uncomment for Google Login */}
                    {/* <div className="text-center mt-4">
                        <h2 className="text-center">Or, Log in with</h2>
                        <button className="btn bg-gray-200 text-indigo-600 rounded-full w-full mt-2"
                            onClick={onClickForGoogle}
                        >
                            <FaGoogle className="mr-2" />
                            Google
                        </button>
                    </div> */}
                </form>
            </div>
        </div>
    );
};

export default Login;

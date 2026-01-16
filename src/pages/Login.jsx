import { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { AuthContext } from '../provider/AuthProvider';

const Login = () => {
  const { login } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const showErrorAlert = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const emailOrMobile = e.target.emailOrMobile.value;
    const pin = e.target.pin.value;

    try {
      const responseData = await login(emailOrMobile, pin);

      if (responseData.success) {
        // role might be "User", "Agent", or "Admin"
        const role = responseData.role;
        if (role === 'Admin') {
          navigate('/dashboard/admin-home');
        } else if (role === 'Agent') {
          navigate('/dashboard/agent-home');
        } else {
          // default user
          navigate('/dashboard/user-home');
        }
      } else {
        throw new Error(responseData.message || 'Login failed');
      }
    } catch (err) {
      showErrorAlert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (email, password, roleName) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const responseData = await login(email, password);

      if (responseData.success) {
        const role = responseData.role;
        if (role === 'Admin') {
          navigate('/dashboard/admin-home');
        } else if (role === 'Agent') {
          navigate('/dashboard/agent-home');
        } else {
          navigate('/dashboard/user-home');
        }
      } else {
        throw new Error(responseData.message || 'Login failed');
      }
    } catch (err) {
      showErrorAlert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600">
      <div className="card bg-white w-full max-w-lg p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Login to Your Account
        </h2>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Email or Mobile Number */}
          <div className="mb-4">
            <label htmlFor="emailOrMobile" className="block text-gray-700">
              Mobile Number / Email
            </label>
            <input
              name="emailOrMobile"
              type="text"
              placeholder="Enter your mobile number or email"
              className="input input-bordered w-full"
              required
              disabled={isLoading}
            />
          </div>

          {/* PIN */}
          <div className="mb-4">
            <label htmlFor="pin" className="block text-gray-700">
              PIN
            </label>
            <input
              name="pin"
              type="password"
              placeholder="Enter your 5-digit PIN"
              className="input input-bordered w-full"
              required
              disabled={isLoading}
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="mt-6 text-center">
            <button
              type="submit"
              className="btn bg-indigo-600 text-white w-full py-2 rounded-full hover:bg-indigo-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>

          <p className="text-center mt-6 text-gray-600">
            Don't Have An Account?{" "}
            <Link className="text-indigo-600 hover:text-indigo-800" to="/auth/register">
              Register
            </Link>
          </p>
        </form>

        {/* Demo Credentials Section */}
        <div className="mt-8 pt-6 border-gray-200">
          <h3 className="rounded border border-gray-300 p-2 text-center text-gray-500 font-semibold mb-4">Quick login with demo credentials</h3>

          <div className="space-y-3">
            {/* Admin Demo Login */}
            <div className="border border-red-200 rounded-lg p-3 bg-red-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">👑</span>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-800">Admin</h3>
                    <p className="text-xs text-gray-500">admin@mfs.com • 12345</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDemoLogin('admin@mfs.com', '12345', 'Admin')}
                  className="btn btn-sm bg-red-500 hover:bg-red-600 text-white rounded disabled:opacity-50"
                  disabled={isLoading}
                >
                  Login
                </button>
              </div>
            </div>

            {/* Agent Demo Login */}
            <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💼</span>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-800">Agent</h3>
                    <p className="text-xs text-gray-500">test@agent.com • 12345</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDemoLogin('test@agent.com', '12345', 'Agent')}
                  className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white rounded disabled:opacity-50"
                  disabled={isLoading}
                >
                  Login
                </button>
              </div>
            </div>

            {/* User Demo Login */}
            <div className="border border-green-200 rounded-lg p-3 bg-green-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">👤</span>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-800">User</h3>
                    <p className="text-xs text-gray-500">test@user.com • 12345</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDemoLogin('test@user.com', '12345', 'User')}
                  className="btn btn-sm bg-green-500 hover:bg-green-600 text-white rounded disabled:opacity-50"
                  disabled={isLoading}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

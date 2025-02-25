import { createContext, useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const API_URL = "http://localhost:5000"; // your server URL

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // const navigate = useNavigate();

  // Make sure axios sends/receives cookies
  axios.defaults.withCredentials = true;

  // Login function
  const login = async (emailOrMobile, pin) => {
    try {
      // Include { withCredentials: true } to allow cookies
      const response = await axios.post(`${API_URL}/login`, {
        emailOrMobile,
        pin,
      }, { withCredentials: true });

      if (response.data.success) {
        // setUser in state
        setUser(response.data.user);
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "You have successfully logged in!",
        });
        return response.data;
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: response.data.message,
        });
        throw new Error(response.data.message);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
      throw error;
    }
  };

  // Registration function
  const register = async (name, pin, email, mobileNumber, accountType, nid) => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        name,
        pin,
        email,
        mobileNumber,
        accountType,
        nid,
      }, { withCredentials: true });

      if (response.data.success) {
        setUser(response.data.user);
        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: "Your account has been created!",
        });
        return response.data;
      } else {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: response.data.message,
        });
        throw new Error(response.data.message);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Clear the cookie from backend
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      setUser(null);
      Swal.fire({
        icon: "success",
        title: "Logged Out",
        text: "You have successfully logged out.",
      });
      // navigate("/auth/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // OPTIONAL: If you want to verify if user is still logged in on page refresh, you could do something like:
  //   useEffect(() => {
  //     axios.get(`${API_URL}/profile`, { withCredentials: true })
  //       .then(res => {
  //         if(res.data.success) {
  //           setUser(res.data.user);
  //         }
  //       })
  //       .catch(err => {
  //         console.log("No valid token or can't fetch profile", err);
  //       });
  //   }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

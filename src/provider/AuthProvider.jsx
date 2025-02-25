import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
// import axios from "axios";

// Create the context
export const AuthContext = createContext();

// Dummy API base URL (replace this with your actual API)
const API_URL = "https://your-backend-api.com"; // Replace with your MongoDB API URL

// Provide AuthContext to your app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
//   const navigate = useNavigate();

  // Dummy login function (simulates checking against MongoDB database)
  const login = async (emailOrMobile, pin) => {
    // try {
    //   const response = await axios.post(`${API_URL}/login`, {
    //     emailOrMobile,
    //     pin,
    //   });
    //   if (response.data.success) {
    //     setUser(response.data.user);
    //     Swal.fire({
    //       icon: "success",
    //       title: "Login Successful",
    //       text: "You have successfully logged in!",
    //     });
    //     navigate("/dashboard"); // Redirect to the dashboard or home page
    //   } else {
    //     Swal.fire({
    //       icon: "error",
    //       title: "Login Failed",
    //       text: response.data.message,
    //     });
    //   }
    // } catch (error) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Error",
    //     text: error.message,
    //   });
    // }
  };

  // Dummy signup function (simulates storing user data in MongoDB)
  const register = async (name, pin, email, mobile, accountType, nid) => {
    // try {
    //   const response = await axios.post(`${API_URL}/register`, {
    //     name,
    //     pin,
    //     email,
    //     mobile,
    //     accountType,
    //     nid,
    //   });
    //   if (response.data.success) {
    //     setUser(response.data.user);
    //     Swal.fire({
    //       icon: "success",
    //       title: "Registration Successful",
    //       text: "Your account has been created!",
    //     });
    //     navigate("/login"); // Redirect to login page after successful registration
    //   } else {
    //     Swal.fire({
    //       icon: "error",
    //       title: "Registration Failed",
    //       text: response.data.message,
    //     });
    //   }
    // } catch (error) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Error",
    //     text: error.message,
    //   });
    // }
  };

  // Dummy logout function
  const logout = () => {
    setUser(null); // Clear the user from state
    navigate("/login"); // Redirect to login page
    Swal.fire({
      icon: "success",
      title: "Logged Out",
      text: "You have successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 

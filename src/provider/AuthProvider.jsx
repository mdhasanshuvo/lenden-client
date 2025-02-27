import { createContext, useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
// import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const API_URL = "https://lenden-server-seven.vercel.app"; // your server URL

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // const navigate = useNavigate();

  // Make sure axios sends/receives cookies
  axios.defaults.withCredentials = true;
  

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/profile`, { withCredentials: true });
        if (res.data.success) {
          // Suppose the backend returns { success: true, user: {...}, role: "Admin"/"User"/"Agent" }
          // or maybe the user doc includes user.role
          const role = res.data.role || res.data.user.role || "User";
          setUser({ ...res.data.user, role });
        }
      } catch (err) {
        console.log("No valid session or can't fetch profile", err);
      }
    };
    fetchProfile();
  }, []);

  /*
   * ========== LOGIN FUNCTION ==========
   * The server can return: { success, role, user } 
   * where role is "User", "Agent", or "Admin".
   */
  const login = async (emailOrMobile, pin) => {
    try {
      const response = await axios.post(
        `${API_URL}/login`,
        { emailOrMobile, pin },
        { withCredentials: true }
      );

      if (response.data.success) {
        // set user in state
        const role = response.data.role;
        setUser({ ...response.data.user, role });

        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: response.data.message || "You have successfully logged in!",
        });
        return response.data; // { success: true, role, user }
      } else {
        // The backend responded with success: false
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: response.data.message,
        });
        throw new Error(response.data.message);
      }
    } catch (error) {
      // The backend might have sent a custom error message in error.response.data.message
      let errMsg = error.message;
      if (error.response && error.response.data && error.response.data.message) {
        errMsg = error.response.data.message;
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errMsg,
      });
      throw error; // re-throw to handle it in upper layers if needed
    }
  };


  /*
   * ========== REGISTRATION FUNCTION ==========
   * We'll call either "/register-user" or "/register-agent"
   * depending on accountType chosen in the form.
   */
  const register = async (name, pin, email, mobileNumber, accountType, nid) => {
    try {
      let endpoint;
      if (accountType === "Agent") {
        endpoint = "/register-agent";
      } else {
        // default is "User"
        endpoint = "/register-user";
      }

      const response = await axios.post(
        `${API_URL}${endpoint}`,
        { name, pin, email, mobileNumber, nid },
        { withCredentials: true }
      );

      if (response.data.success) {
        // The server returns something like { success: true, user: {...} }
        // This user doesn't have a 'role' from /register-user or /register-agent,
        // so we might add it manually:
        const role = accountType === "Agent" ? "Agent" : "User";
        const userData = { ...response.data.user, role };
        setUser(userData);

        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: "Your account has been created!",
        });
        return { success: true, role, user: userData };
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

  /*
   * ========== LOGOUT FUNCTION ==========
   */
  const logout = async () => {
    try {
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

  /*
   * ========== OPTIONAL AUTO-LOGIN ON REFRESH ==========
   * If you want to check if a user is already logged in 
   * when the app loads, you can uncomment:
   */
  // useEffect(() => {
  //   axios.get(`${API_URL}/profile`, { withCredentials: true })
  //     .then(res => {
  //       if(res.data.success) {
  //         const userDoc = res.data.user;
  //         // We also have a role in res.data.role if your server returns that
  //         // e.g. setUser({ ...userDoc, role: res.data.role })
  //         setUser(userDoc);
  //       }
  //     })
  //     .catch(err => {
  //       console.log("No valid token or can't fetch profile", err);
  //     });
  // }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

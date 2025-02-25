import { createBrowserRouter } from "react-router-dom";
import GetStarted from "../pages/GetStarted";
import Register from "../pages/Register";
import Login from "../pages/Login";
import AdminHome from "../pages/AdminHome";
import AgentHome from "../pages/AgentHome";
import UserHome from "../pages/UserHome";
import DashboardLayout from "../Layout/DashboardLayout";

const router = createBrowserRouter([
    {
        path: "/",
        element: <GetStarted></GetStarted>
    },
    {
        path: '/auth/register',
        element: <Register></Register>,
    },
    {
        path: '/auth/login',
        element: <Login></Login>
    },
    {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
            { 
                path: "admin-home",
                element: <AdminHome></AdminHome>
            },
            { 
                path: "agent-home",
                element: <AgentHome /> 
            },
            { 
                path: "user-home",
                element: <UserHome />
            },
        ],
    },

]);

export default router;
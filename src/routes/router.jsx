import { createBrowserRouter } from "react-router-dom";
import GetStarted from "../pages/GetStarted";
import Register from "../pages/Register";
import Login from "../pages/Login";
import AdminHome from "../pages/AdminHome";
import AgentHome from "../pages/AgentHome";
import UserHome from "../pages/UserHome";
import DashboardLayout from "../Layout/DashboardLayout";
import SendMoney from "../pages/SendMoney";
import CashOut from "../pages/CashOut";
import CashIn from "../pages/CashIn";
import ManageUsers from "../pages/ManageUsers";
import ManageAgents from "../pages/ManageAgents";
import AgentApproval from "../pages/AgentApproval";
import RequestCash from "../pages/RequestCash";
import ManageAgentRequests from "../pages/ManageAgentRequests";

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
            {
                path: "user/send-money",
                element: <SendMoney></SendMoney>
            },
            {
                path: "user/cash-out",
                element: <CashOut></CashOut>
            },
            {
                path: "agent/cash-in-users",
                element: <CashIn></CashIn>
            },
            {
                path: "agent/cash-request",
                element: <RequestCash></RequestCash>
            },
            {
                path: "admin/manage-users",
                element: <ManageUsers />
            },
            {
                path: "admin/manage-users",
                element: <ManageUsers />
            },
            {
                path: "admin/manage-agents",
                element: <ManageAgents></ManageAgents>
            },
            {
                path: "admin/agent-approvals",
                element: <AgentApproval></AgentApproval>
            },
            {
                path: "admin/agent-requests",
                element: <ManageAgentRequests></ManageAgentRequests>
            },
        ],
    },

]);

export default router;
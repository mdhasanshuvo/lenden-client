import { createBrowserRouter } from "react-router-dom";
import GetStarted from "../pages/GetStarted";
import Register from "../pages/Register";
import Login from "../pages/Login";

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
]);

export default router;
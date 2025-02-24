import { createBrowserRouter } from "react-router-dom";
import GetStarted from "../pages/GetStarted";
import Register from "../pages/Register";

const router = createBrowserRouter([
    {
        path: "/",
        element: <GetStarted></GetStarted>
    },
    {
        path: '/auth/register',
        element: <Register></Register>,
    },
]);

export default router;
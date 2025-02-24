import { createBrowserRouter } from "react-router-dom";
import GetStarted from "../pages/GetStarted";

const router = createBrowserRouter([
    {
        path: "/",
        element: <GetStarted></GetStarted>
    }
]);

export default router;
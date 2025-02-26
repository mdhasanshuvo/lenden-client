import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";
import Loading from "../pages/Loading";


const PrivateRoute = ({children}) => {

    const { user } = useContext(AuthContext);

    const location = useLocation();
    
    console.log(location);

    if(!user){
        return <Loading></Loading>;
    }


    if (user) {
        return children;
    }
    return <Navigate state={location} to={`/auth/login`}></Navigate>
};

export default PrivateRoute;
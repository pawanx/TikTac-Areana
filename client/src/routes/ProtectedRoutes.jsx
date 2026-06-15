import { useAuth } from "../contexts/AuthContext";
import {Navigate} from "react-router-dom"

const ProtectedRoutes = ({children}) => {
    
    const {user} = useAuth();

    if(!user){
        <Navigate to="/login"/>
    }

    return children
}

export default ProtectedRoutes
import { useAuth } from "../contexts/AuthContext";
import {Navigate} from "react-router-dom"

const ProtectedRoutes = ({children}) => {
    
    const {user} = useAuth();
    

    if(!user){
        return <Navigate to="/auth"/>
    }

    return children
}

export default ProtectedRoutes
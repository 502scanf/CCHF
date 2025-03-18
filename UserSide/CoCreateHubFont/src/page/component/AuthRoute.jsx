import  {getToken} from "@page/util/token.js";
import {Navigate} from "react-router-dom";

function AuthRoute({children}){

    const token = getToken();

    if(token == null){
        return <Navigate to={'/login'} replace/>
    }
    return <>{children}</>

}

export default AuthRoute

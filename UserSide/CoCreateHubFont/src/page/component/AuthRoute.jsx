import {getLoginTime, getToken} from "@page/util/token.js";
import {Navigate} from "react-router-dom";
import {tokenOutTime} from "@page/util/token.js";

function AuthRoute({children}){

    const token = getToken();

    if(token == null || tokenOutTime(getLoginTime())){
        return <Navigate to={'/login'} replace/>
    }
    return <>{children}</>

}

export default AuthRoute

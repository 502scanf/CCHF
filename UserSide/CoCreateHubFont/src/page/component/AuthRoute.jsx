import { getLoginTime, getToken } from "@page/util/token.js";
import { Navigate } from "react-router-dom";
import { tokenOutTime } from "@page/util/token.js";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserByUid } from "../store/reducers/user";
import { useEffect } from "react";

function AuthRoute({ children }) {

    const token = getToken();
    const dispatch = useDispatch();
    const { uname } = useSelector(state => state.user);

    useEffect(() => {
        if (token && !uname) {
            dispatch(fetchUserByUid());
        }
    }, [])

    if (token == null || tokenOutTime(getLoginTime())) {
        return <Navigate to={'/login'} replace />
    }
    return <>{children}</>

}

export default AuthRoute

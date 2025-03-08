import {createSlice} from "@reduxjs/toolkit";
import {setToken as _setToken, getToken} from "@page/util/token.js";
import {loginApi} from "@page/api/user.js";

const userSlice = createSlice({
    name: 'user',
    initialState:{
        token: getToken() || ' ',
    },
    reduces:{
        setToken(state, action){
            state.token = action.payload
            _setToken(action.payload)
        }
    }
})

const {setToken} = userSlice.actions
const userReducer = userSlice.reducer

const fetchUser = (loginData)=>{
    return async (dispatch)=>{
       const res = await loginApi(loginData)
        dispatch(setToken(res.data.token))
    }
}

export {fetchUser ,setToken}
export default userReducer



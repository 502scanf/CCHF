import {createSlice} from "@reduxjs/toolkit";
import {getToken, setToken} from "@page/util/token.js";
import {loginApi} from "@page/api/user.js";

const userSlice = createSlice({
    name: 'user',
    initialState:{
        token: getToken() || ' ',
    },
    reducers:{
        sT(state,action){
            state.token = action.payload
            setToken(action.payload)
    }
    }
})

const {sT} = userSlice.actions;
const userReducer = userSlice.reducer

const fetchUser = (loginData) =>{
    return async (dispatch)=>{
        const res = await loginApi(loginData)
        dispatch(sT(res.data.token))
    }
}

export {fetchUser, sT}
export default userReducer

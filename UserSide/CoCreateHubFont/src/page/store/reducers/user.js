import {createSlice} from "@reduxjs/toolkit";
import {getToken, setToken, loginTime} from "@page/util/token.js";
import {loginApi, signApi} from "@page/api/user.js";

let R = Math.random().toString(16).split(".")[1]
let color = "#"+R.slice(0,6)

const userSlice = createSlice({
    name: 'user',
    initialState:{
        token: getToken() || ' ',
        uname: null,
        mail: null,
        logo:null,
        loginTime: null,
        backColor: null
    },
    reducers:{
        sT(state,action){
            state.token = action.payload
            setToken(action.payload)
        },
        sN(state, action){
            state.uname = action.payload
        },
        sM(state, action){
            state.mail = action.payload
        },
        sL(state, action){
            state.logo = action.payload
        },
        sC(state, action){
            state.backColor = action.payload
        },
        sTime(state, action){
            state.tTime = action.payload
            loginTime(action.payload)
        }
    }
})

const {sT,sN, sL, sM, sC, sTime} = userSlice.actions;
const userReducer = userSlice.reducer

const fetchUser = (loginData) =>{
    return async (dispatch)=>{
        const res = await loginApi(loginData)
        dispatch(sT(res.data.token))
        dispatch(sN(res.data.uname))
        dispatch(sM(res.data.mail))
        dispatch(sL(res.data.logo))
        dispatch(sTime(res.data.loginTime))
        dispatch(sC(color))
    }
}

const signUser = (signData)=>{
    return async (dispatch) =>{
        const res = await signApi(signData)
    }
}

export {signUser, fetchUser, sT, sN, sM, sL, sC}
export default userReducer

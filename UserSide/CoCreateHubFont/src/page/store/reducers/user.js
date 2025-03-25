import {createSlice} from "@reduxjs/toolkit";
import {getToken, setToken, loginTime} from "@page/util/token.js";
import {deleteUserApi, editUserApi, loginApi, signApi} from "@page/api/user.js";

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
        },
        logout(state) {
            state.token = null;
            state.uname = null;
            state.mail = null;
            state.logo = null;
            state.loginTime = null;
            state.backColor = null;
            setToken(null); // 清除本地存储的 token
        }
    }
})

const {logout,sT,sN, sL, sM, sC, sTime} = userSlice.actions;
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

const editUser = (editData) =>{
    return async (dispatch)=>{
        const res = await editUserApi(editData)
        dispatch(sN(res.data.uname))
        dispatch(sM(res.data.mail))
        dispatch(sL(res.data.logo))
        dispatch(sC(color))
    }
}

const signUser = (signData)=>{
    return async (dispatch) =>{
        const res = await signApi(signData)
    }
}

const logoutUser = () => {
    return (dispatch) => {
        dispatch(logout())
    }
}

const deleteUser = () => {
    return async (dispatch) => {
        await deleteUserApi()
        dispatch(logout())
    }
}

export {signUser, fetchUser,editUser, sT, sN, sM, sL, sC,logoutUser,deleteUser}
export default userReducer

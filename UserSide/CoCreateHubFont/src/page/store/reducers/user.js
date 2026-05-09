import { createSlice } from "@reduxjs/toolkit";
import { getToken, setToken, loginTime } from "@page/util/token.js";
import { deleteUserApi, editUserApi, loginApi, signApi, getUnameApi } from "@page/api/user.js";

let R = Math.random().toString(16).split(".")[1]
let color = "#" + R.slice(0, 6)

// 从 token 中解析 uid
const getUidFromToken = () => {
    const token = getToken()
    if (!token) return null
    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return payload.userId || payload.uid || payload.id || null
    } catch (e) {
        return null
    }
}

const userSlice = createSlice({
    name: 'user',
    initialState: {
        token: getToken() || ' ',
        uname: null,
        uid: getUidFromToken(),
        mail: null,
        logo: null,
        loginTime: null,
        backColor: null
    },
    reducers: {
        sT(state, action) {
            state.token = action.payload
            setToken(action.payload)
        },
        sN(state, action) {
            state.uname = action.payload
        },
        sM(state, action) {
            state.mail = action.payload
        },
        sL(state, action) {
            state.logo = action.payload
        },
        sC(state, action) {
            state.backColor = action.payload
        },
        sU(state, action) {
            state.uid = action.payload
        },
        sTime(state, action) {
            state.tTime = action.payload
            loginTime(action.payload)
        },
        logout(state) {
            state.token = null;
            state.uname = null;
            state.uid = null;
            state.mail = null;
            state.logo = null;
            state.loginTime = null;
            state.backColor = null;
            setToken(null); // 清除本地存储的 token
        }
    }
})

const { logout, sT, sN, sL, sM, sC, sTime, sU } = userSlice.actions;
const userReducer = userSlice.reducer

const fetchUser = (loginData) => {
    return async (dispatch) => {
        const res = await loginApi(loginData)
        dispatch(sT(res.data.token))
        dispatch(sN(res.data.uname))
        dispatch(sM(res.data.mail))
        dispatch(sL(res.data.logo))
        dispatch(sTime(res.data.loginTime))
        dispatch(sC(color))
        // 从 JWT token 中解析 uid
        try {
            const payload = JSON.parse(atob(res.data.token.split('.')[1]))
            const uid = payload.userId || payload.uid || payload.id
            if (uid) dispatch(sU(uid))
        } catch (e) { /* ignore */ }
    }
}

const fetchUserByUid = () => {
    return async (dispatch) => {
        const res = await getUnameApi()
        dispatch(sN(res.data))
        dispatch(sC(color))
    }
}
const editUser = (editData) => {
    return async (dispatch) => {
        const res = await editUserApi(editData)
        dispatch(sN(res.data.uname))
        dispatch(sM(res.data.mail))
        dispatch(sL(res.data.logo))
        dispatch(sC(color))
    }
}

const signUser = (signData) => {
    return async (dispatch) => {
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

export { fetchUserByUid, signUser, fetchUser, editUser, sT, sN, sM, sL, sC, logoutUser, deleteUser }
export default userReducer

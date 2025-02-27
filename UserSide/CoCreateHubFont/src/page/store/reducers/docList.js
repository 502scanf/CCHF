import {createSlice}  from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const docListSlice = createSlice({
    name:'docList',
    initialState:{
        docList:[]
    },
    reducers:{
        setDocList(state, action){
            state.docList = action.payload
        }
    }
})
const {setDocList} = docListSlice.actions
const fetchDoclist = ()=>{
    return async (dispatch)=>{
        const response = await axios.get(`${BASE_URL}/docList`)
        dispatch(setDocList(response.data.docList))
    }
}

export {fetchDoclist}
const reducer = docListSlice.reducer
export default reducer

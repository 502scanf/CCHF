import {createSlice}  from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const docSlice = createSlice({
    name:'doc',
    initialState:{
        docList:[],

    },
    reducers:{
        setDocList(state, action){
            state.docList = action.payload
        }
    }
})
const {setDocList} = docSlice.actions
const fetchDoclist = ()=>{
    return async (dispatch)=>{
        const response = await axios.get(`${BASE_URL}/docList`)
        dispatch(setDocList(response.data.docList))
    }
}

export {fetchDoclist}
const docReducer = docSlice.reducer
export default docReducer

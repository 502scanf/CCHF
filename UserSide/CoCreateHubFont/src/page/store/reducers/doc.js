import {createSlice}  from "@reduxjs/toolkit";
import {docListApi} from "@page/api/doc.js";

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
const fetchDocList = ()=>{
    return async (dispatch)=>{
        const response = await docListApi()
        dispatch(setDocList(response.data))
    }
}

export {fetchDocList}
const docReducer = docSlice.reducer
export default docReducer

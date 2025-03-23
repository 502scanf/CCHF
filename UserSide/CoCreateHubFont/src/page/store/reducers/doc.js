import {createSlice}  from "@reduxjs/toolkit";
import {docBuildApi, docListApi} from "@page/api/doc.js";

const docSlice = createSlice({
    name:'doc',
    initialState:{
        docList:[],
    },
    reducers:{
        //同步修改
        setDocList(state, action){
            state.docList = action.payload
        },
        //同步添加房间
        addDoc(state, action){
            state.docList.push(action.payload)
        }
    }
})
const {setDocList,addDoc} = docSlice.actions
const fetchDocList = (docListData)=>{
    return async (dispatch)=>{
        const response = await docListApi(docListData)
        dispatch(setDocList(response.data))
    }
}

const addDocList = (docBuildData)=>{
    return async (dispatch)=>{
        const response = await docBuildApi (docBuildData)
        dispatch(addDoc(response.data))
    }
}

export {fetchDocList,addDocList}
const docReducer = docSlice.reducer
export default docReducer

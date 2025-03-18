import {createSlice}  from "@reduxjs/toolkit";
import axios from "axios";
import {roomListApi} from "@page/api/room.js";

const roomSlice = createSlice({
    name:'room',
    initialState:{
        roomList: []
    },
    reducers:{
        setRoomList(state, action){
            state.roomList = action.payload
        }
    }
})

const {setRoomList} = roomSlice.actions
const fetchRoomList = (roomListData)=>{
    return async (dispatch)=>{
        const response = await roomListApi(roomListData)
        dispatch(setRoomList(response.data))
    }
}

export {fetchRoomList}
const roomReducer = roomSlice.reducer
export default roomReducer
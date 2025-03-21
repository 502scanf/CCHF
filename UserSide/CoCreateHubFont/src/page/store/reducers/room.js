import {createSlice}  from "@reduxjs/toolkit";
import {roomBuildApi, roomListApi} from "@page/api/room.js";

const roomSlice = createSlice({
    name:'room',
    initialState:{
        roomList: []
    },
    reducers:{
        //同步修改
        setRoomList(state, action){
            state.roomList = action.payload
        },
        //同步添加房间
        addRoom(state, action){
            state.roomList.push(action.payload)
        }
    }
})

const {setRoomList,addRoom} = roomSlice.actions
const fetchRoomList = (roomListData)=>{
    return async (dispatch)=>{
        const response = await roomListApi(roomListData)
        dispatch(setRoomList(response.data))
    }
}

const addRoomList = (roomBuildData)=>{
    return async (dispatch)=>{
        const response = await roomBuildApi (roomBuildData)
        dispatch(addRoom(response.data))
    }
}

export {fetchRoomList,addRoomList}
const roomReducer = roomSlice.reducer
export default roomReducer
import {createSlice}  from "@reduxjs/toolkit";
import {roomBuildApi, roomFindApi, roomListApi} from "@page/api/room.js";

const roomSlice = createSlice({
    name:'room',
    initialState:{
        roomList: [],
    },
    reducers:{
        //同步修改
        setRoomList(state, action){
            // 检查 action.payload 是否是数组
            if (Array.isArray(action.payload)) {
                state.roomList = action.payload;
            } else {
                // 如果是对象，将其转换为数组
                state.roomList = [action.payload];
            }
        },
        //同步添加房间
        addRoom(state, action){
            state.roomList.push(action.payload)
        },
    }
})

const {setRoomList,addRoom} = roomSlice.actions
const fetchRoomList = (roomListData)=>{
    return async (dispatch)=>{
        const response = await roomListApi(roomListData)
        dispatch(setRoomList(response.data))
        return response.data
    }
}

const addRoomList = (roomBuildData)=>{
    return async (dispatch)=>{
        const response = await roomBuildApi (roomBuildData)
        dispatch(addRoom(response.data))
        return response.data
    }
}

const getRoom = (roomFindData) => {
    return async (dispatch) => {
        try {
            const response = await roomFindApi(roomFindData);
            if (response.data === null) {
                throw new Error('房间不存在');
            }
            dispatch(setRoomList([response.data])); // 将单个对象转换为数组
        } catch (error) {
            // 捕获错误并抛出
            throw error;
        }
    };
}

export {fetchRoomList,addRoomList,getRoom}
const roomReducer = roomSlice.reducer
export default roomReducer
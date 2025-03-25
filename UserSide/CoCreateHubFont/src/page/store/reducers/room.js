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
        const res = await roomListApi(roomListData)
        dispatch(setRoomList(res.data))
        return res.data
    }
}

const addRoomList = (roomBuildData)=>{
    return async (dispatch)=>{
        const res = await roomBuildApi (roomBuildData)
        dispatch(addRoom(res.data))
        return res.data
    }
}

const getRoom = (roomFindData) => {
    return async (dispatch) => {
        try {
            const res = await roomFindApi(roomFindData);
            if (res.data === null) {
                throw new Error('房间不存在');
            }
            dispatch(setRoomList([res.data])); // 将单个对象转换为数组
        } catch (error) {
            // 捕获错误并抛出
            throw error;
        }
    };
}

export {fetchRoomList,addRoomList,getRoom}
const roomReducer = roomSlice.reducer
export default roomReducer
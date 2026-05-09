import { createSlice } from "@reduxjs/toolkit";
import {
    roomBuildApi,
    roomFindApi,
    roomListApi,
    roomListPageApi,
    getRecycledRoomsApi,
    getRecycledRoomsPageApi,
    restoreRoomApi,
    deleteRoomPermanentlyApi,
    roomRecycleApi,
    getRelatedRoomsApi,
    getRelatedRoomsPageApi,
    renameRoomApi
} from "@page/api/room.js";

const roomSlice = createSlice({
    name: 'room',
    initialState: {
        roomList: [],
        recycledRoomList: [],
        pagination: {
            total: 0,
            page: 1,
            pageSize: 10,
            totalPages: 0
        },
        recycledPagination: {
            total: 0,
            page: 1,
            pageSize: 10,
            totalPages: 0
        }
    },
    reducers: {
        setRoomList(state, action) {
            if (Array.isArray(action.payload)) {
                state.roomList = action.payload;
            } else {
                state.roomList = [action.payload];
            }
        },
        setRoomListWithPagination(state, action) {
            state.roomList = action.payload.records;
            state.pagination = {
                total: action.payload.total,
                page: action.payload.page,
                pageSize: action.payload.pageSize,
                totalPages: action.payload.totalPages
            };
        },
        addRoom(state, action) {
            state.roomList.push(action.payload)
        },
        removeRoom(state, action) {
            state.roomList = state.roomList.filter(r => r.roomid !== action.payload)
        },
        setRecycledRoomList(state, action) {
            state.recycledRoomList = Array.isArray(action.payload)
                ? action.payload
                : [action.payload];
        },
        setRecycledRoomListWithPagination(state, action) {
            state.recycledRoomList = action.payload.records;
            state.recycledPagination = {
                total: action.payload.total,
                page: action.payload.page,
                pageSize: action.payload.pageSize,
                totalPages: action.payload.totalPages
            };
        },
        removeRecycledRoom(state, action) {
            state.recycledRoomList = state.recycledRoomList.filter(r => r.roomid !== action.payload)
        },
        updateRoomName(state, action) {
            const { roomid, newName } = action.payload;
            // 更新 roomList 中的房间名称
            const room = state.roomList.find(r => r.roomid === roomid);
            if (room) {
                room.roomname = newName;
            }
        }
    }
})

const { setRoomList, setRoomListWithPagination, addRoom, removeRoom, setRecycledRoomList, setRecycledRoomListWithPagination, removeRecycledRoom, updateRoomName } = roomSlice.actions

// 获取我创建的房间列表
const fetchRoomList = () => {
    return async (dispatch) => {
        const res = await roomListApi()
        dispatch(setRoomList(res.data))
        return res.data
    }
}

// 分页获取我创建的房间列表
const fetchRoomListPage = (page = 1, pageSize = 10) => {
    return async (dispatch) => {
        const res = await roomListPageApi(page, pageSize)
        dispatch(setRoomListWithPagination(res.data))
        return res.data
    }
}

// 获取我加入的所有房间
const fetchRelatedRooms = () => {
    return async (dispatch) => {
        const res = await getRelatedRoomsApi()
        dispatch(setRoomList(res.data))
        return res.data
    }
}

// 分页获取我加入的所有房间
const fetchRelatedRoomsPage = (page = 1, pageSize = 10) => {
    return async (dispatch) => {
        const res = await getRelatedRoomsPageApi(page, pageSize)
        dispatch(setRoomListWithPagination(res.data))
        return res.data
    }
}

const addRoomList = (roomBuildData) => {
    return async (dispatch) => {
        const res = await roomBuildApi(roomBuildData)
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
            dispatch(setRoomList([res.data]));
        } catch (error) {
            throw error;
        }
    };
}

// 获取回收站房间列表
const fetchRecycledRoomList = () => {
    return async (dispatch) => {
        const res = await getRecycledRoomsApi()
        dispatch(setRecycledRoomList(res.data))
        return res.data
    }
}

// 分页获取回收站房间列表
const fetchRecycledRoomListPage = (page = 1, pageSize = 10) => {
    return async (dispatch) => {
        const res = await getRecycledRoomsPageApi(page, pageSize)
        dispatch(setRecycledRoomListWithPagination(res.data))
        return res.data
    }
}

// 回收房间
const recycleRoom = (roomid) => {
    return async (dispatch) => {
        await roomRecycleApi(roomid)
        dispatch(removeRoom(roomid))
    }
}

// 恢复房间
const restoreRoom = (roomid) => {
    return async (dispatch) => {
        await restoreRoomApi(roomid)
        dispatch(removeRecycledRoom(roomid))
    }
}

// 永久删除房间
const deleteRoomPermanently = (roomid) => {
    return async (dispatch) => {
        await deleteRoomPermanentlyApi(roomid)
        dispatch(removeRecycledRoom(roomid))
    }
}

// 修改房间名称
const renameRoom = (roomid, newName) => {
    return async (dispatch) => {
        await renameRoomApi({ roomid, newName })
        dispatch(updateRoomName({ roomid, newName }))
    }
}

export {
    fetchRoomList,
    fetchRoomListPage,
    addRoomList,
    getRoom,
    fetchRelatedRooms,
    fetchRelatedRoomsPage,
    fetchRecycledRoomList,
    fetchRecycledRoomListPage,
    recycleRoom,
    restoreRoom,
    deleteRoomPermanently,
    renameRoom
}
const roomReducer = roomSlice.reducer
export default roomReducer

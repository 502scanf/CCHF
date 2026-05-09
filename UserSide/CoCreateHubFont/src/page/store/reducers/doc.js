import { createSlice } from "@reduxjs/toolkit";
import { docBuildApi, docListApi, docListPageApi, docImportApi, docRenameApi, docDeleteApi } from "@page/api/doc.js";

const docSlice = createSlice({
    name: 'doc',
    initialState: {
        docList: [],
        pagination: {
            total: 0,
            page: 1,
            pageSize: 10,
            totalPages: 0
        }
    },
    reducers: {
        //同步修改
        setDocList(state, action) {
            state.docList = action.payload
        },
        //同步修改（带分页信息）
        setDocListWithPagination(state, action) {
            state.docList = action.payload.records
            state.pagination = {
                total: action.payload.total,
                page: action.payload.page,
                pageSize: action.payload.pageSize,
                totalPages: action.payload.totalPages
            }
        },
        //同步添加房间
        addDoc(state, action) {
            state.docList.push(action.payload)
        },
        //同步删除文档
        removeDoc(state, action) {
            state.docList = state.docList.filter(doc => doc.docid !== action.payload)
        },
        //同步更新文档名称
        updateDocName(state, action) {
            const { docid, newName } = action.payload
            const doc = state.docList.find(d => d.docid === docid)
            if (doc) {
                doc.docname = newName
            }
        }
    }
})
const { setDocList, setDocListWithPagination, addDoc, removeDoc, updateDocName } = docSlice.actions

const fetchDocList = (docListData) => {
    return async (dispatch) => {
        const res = await docListApi(docListData)
        dispatch(setDocList(res.data))
    }
}

const fetchDocListPage = (roomid, page = 1, pageSize = 10) => {
    return async (dispatch) => {
        const res = await docListPageApi(roomid, page, pageSize)
        dispatch(setDocListWithPagination(res.data))
        return res.data
    }
}

const addDocList = (docBuildData) => {
    return async (dispatch) => {
        const res = await docBuildApi(docBuildData)
        dispatch(addDoc(res.data))
        return res.data
    }
}

const importDocList = (docImportData) => {
    return async (dispatch) => {
        const res = await docImportApi(docImportData)
        dispatch(addDoc(res.data))
        return res.data
    }
}

const renameDocList = (docid, newName) => {
    return async (dispatch) => {
        await docRenameApi(docid, newName)
        dispatch(updateDocName({ docid, newName }))
    }
}

const deleteDocList = (docid) => {
    return async (dispatch) => {
        await docDeleteApi(docid)
        dispatch(removeDoc(docid))
    }
}

export { fetchDocList, fetchDocListPage, addDocList, importDocList, renameDocList, deleteDocList }
const docReducer = docSlice.reducer
export default docReducer

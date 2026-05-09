import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchRecycledRoomListPage, restoreRoom, deleteRoomPermanently } from "@page/store/reducers/room.js"
import "./Recycle.css"
import work from "@assets/workPlace.svg"
import nullImg from "@assets/null.jpg"
import { message, Modal, Pagination } from 'antd'
import RoomActionMenu from "@page/component/RoomActionMenu.jsx"

const Recycle = () => {
    const dispatch = useDispatch()
    const { recycledRoomList, recycledPagination } = useSelector(state => state.room)
    const { uid } = useSelector(state => state.user)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    useEffect(() => {
        dispatch(fetchRecycledRoomListPage(currentPage, pageSize))
    }, [dispatch, currentPage, pageSize])

    // 分页变化处理
    const handlePageChange = (page, newPageSize) => {
        setCurrentPage(page)
        if (newPageSize !== pageSize) {
            setPageSize(newPageSize)
        }
    }

    // 恢复房间
    const handleRestore = async (roomid) => {
        try {
            await dispatch(restoreRoom(roomid))
            message.success('已恢复')
        } catch (e) {
            message.error(e.message || '恢复失败，可能您不是房主')
        }
    }

    // 永久删除房间
    const handleDelete = (roomid) => {
        Modal.confirm({
            title: '确认永久删除',
            content: '此操作不可恢复！房间及其所有文件将被永久删除。',
            okText: '永久删除',
            okType: 'danger',
            cancelText: '取消',
            onOk: async () => {
                try {
                    await dispatch(deleteRoomPermanently(roomid))
                    message.success('已永久删除')
                } catch (e) {
                    message.error(e.message || '删除失败，可能您不是房主')
                }
            }
        })
    }

    // 判断是否为房主（暂时默认 false，和 WorkPlaceManage 保持一致）
    const isOwner = (item) => {
        return item.onerid === uid
    }

    const getRecycleMenuItems = (item) => {
        const owner = isOwner(item)
        return [
            {
                label: '恢复',
                disabled: !owner,
                onClick: () => handleRestore(item.roomid)
            },
            {
                label: '永久删除',
                disabled: !owner,
                onClick: () => handleDelete(item.roomid)
            }
        ]
    }

    return (
        <div className="recycle-container">
            <h3 className="recycle-title">回收站</h3>
            <p className="recycle-hint">回收站中的房间将在 7 天后自动删除</p>
            {(recycledRoomList && recycledRoomList.length > 0) ? (
                <>
                    <div className="recycle-list">
                        {recycledRoomList.map((item) => {
                            if (item && item.roomid) {
                                return (
                                    <div key={item.roomid} className="recycle-item">
                                        <RoomActionMenu items={getRecycleMenuItems(item)} />
                                        <img src={work} alt="Room" className="recycle-img" />
                                        <span>{item.roomname}</span>
                                    </div>
                                )
                            }
                            return null
                        })}
                    </div>
                    <div className="pagination-container">
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={recycledPagination.total}
                            onChange={handlePageChange}
                            showSizeChanger
                            showQuickJumper
                            showTotal={(total) => `共 ${total} 个回收项`}
                            pageSizeOptions={['10', '20', '30', '50']}
                        />
                    </div>
                </>
            ) : (
                <img src={nullImg} alt="Null Image" className="null-img" />
            )}
        </div>
    )
}

export default Recycle
import nullImg from '@assets/null.jpg';
import './FileSpace.css'
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import doc from "@assets/doc.svg";
import { fetchDocListPage } from "@page/store/reducers/doc.js";
import { Pagination, message } from 'antd';

const FileSpace = () => {
    const { docList, pagination } = useSelector(state => state.doc)
    const dispatch = useDispatch()
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    // 注意：这里需要roomid，但FileSpace组件当前没有roomid
    // 你可能需要从路由参数、props或store中获取roomid
    // 暂时使用一个默认值或从某处获取
    const roomid = useSelector(state => state.room.currentRoomId) || 'default'

    useEffect(() => {
        if (roomid && roomid !== 'default') {
            dispatch(fetchDocListPage(roomid, currentPage, pageSize))
        } else {
            message.warning('请先选择一个工作区')
        }
    }, [dispatch, roomid, currentPage, pageSize])

    // 分页变化处理
    const handlePageChange = (page, newPageSize) => {
        setCurrentPage(page)
        if (newPageSize !== pageSize) {
            setPageSize(newPageSize)
        }
    }

    return (
        <div className="doc-container">
            {docList && docList.length > 0 ? (
                <>
                    <div className="docList">
                        {docList.map((item, index) => (
                            <div key={index} className="doc-item">
                                <img
                                    src={doc}
                                    alt="Document"
                                    className="doc-img"
                                />
                                <span>{item.docname}</span>
                            </div>
                        ))}
                    </div>
                    <div className="pagination-container">
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={pagination.total}
                            onChange={handlePageChange}
                            showSizeChanger
                            showQuickJumper
                            showTotal={(total) => `共 ${total} 个文件`}
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

export default FileSpace

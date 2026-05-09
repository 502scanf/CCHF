import nullImg from "@assets/null.jpg";
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchRoomListPage, getRoom, fetchRelatedRoomsPage, recycleRoom, renameRoom } from "@page/store/reducers/room.js";
import "./WorkPlaceManage.css"
import work from "@assets/workPlace.svg";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, message, theme, Modal, Pagination } from 'antd';
import { SearchOutlined } from "@ant-design/icons";
import { PopForm } from "@page/component/Form.jsx";
import RoomActionMenu from "@page/component/RoomActionMenu.jsx";

const WorkPlaceManage = () => {

    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { roomList, pagination } = useSelector(state => state.room)
    const { uname, uid } = useSelector(state => state.user)
    const [inputValue, setInputValue] = useState('')
    const dispatch = useDispatch()
    const [selectRoomName, setSelectRoomName] = useState(null)
    const [selectRoomId, setSelectRoomId] = useState(null)
    const [activeTab, setActiveTab] = useState('related') // 'related' | 'created'
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [renameModalVisible, setRenameModalVisible] = useState(false)
    const [renameRoomId, setRenameRoomId] = useState(null)
    const [newRoomName, setNewRoomName] = useState('')

    // 根据标签页获取房间列表
    useEffect(() => {
        if (activeTab === 'related') {
            dispatch(fetchRelatedRoomsPage(currentPage, pageSize))
        } else {
            dispatch(fetchRoomListPage(currentPage, pageSize))
        }
    }, [dispatch, activeTab, currentPage, pageSize])

    // 切换标签页时重置页码
    const handleTabChange = (tab) => {
        setActiveTab(tab)
        setCurrentPage(1)
    }

    // 分页变化处理
    const handlePageChange = (page, newPageSize) => {
        setCurrentPage(page)
        if (newPageSize !== pageSize) {
            setPageSize(newPageSize)
        }
    }

    const handleChange = (e) => {
        setInputValue(e.target.value)
    }

    const handleClick = async () => {
        if (!inputValue.trim()) {
            message.warning('请输入工作区名称');
            return;
        }
        try {
            await dispatch(getRoom(inputValue));
        } catch (error) {
            if (error.message) {
                message.error(error.message);
            } else {
                message.error('请求失败，请稍后再试');
            }
        }
    };

    const onFinish = async (value) => {
        try {
            navigate(`/work/${selectRoomId}`)
        } catch {
            message.error('失败')
        }
    }
    const onFinishFailed = (errorInfo) => {
        message.error("请检查工作区信息是否正确！");
    };
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [isShow, setIsShow] = useState(false);
    const show = () => setIsShow(true)
    const close = () => setIsShow(false)

    const roomClick = (roomid, roomname) => {
        show()
        setSelectRoomName(roomname)
        setSelectRoomId(roomid)
        form.setFieldsValue({ roomname: roomname })
    }

    // 判断当前用户是否为房主
    const isOwner = (item) => {
        console.log('Room item:', item)  // 查看完整的房间对象
        console.log('Current uid:', uid)  // 查看当前用户ID
        return item.onerid === uid
    }

    // 回收房间
    const handleRecycle = async (roomid) => {
        Modal.confirm({
            title: '确认回收',
            content: '回收后房间将进入回收站，7天后自动删除。确认回收？',
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                try {
                    await dispatch(recycleRoom(roomid))
                    message.success('已回收')
                } catch (e) {
                    message.error(e.message || '回收失败，可能您不是房主')
                }
            }
        })
    }

    // 修改房间名称（暂时提示功能）
    const handleRename = (roomid, currentName) => {
        setRenameRoomId(roomid)
        setNewRoomName(currentName)
        setRenameModalVisible(true)
    }

    // 确认修改名称
    const handleRenameConfirm = async () => {
        if (!newRoomName.trim()) {
            message.warning('请输入新的工作区名称')
            return
        }

        try {
            await dispatch(renameRoom(renameRoomId, newRoomName.trim()))
            message.success('修改成功')
            setRenameModalVisible(false)
            setRenameRoomId(null)
            setNewRoomName('')
        } catch (e) {
            message.error(e.message || '修改失败')
        }
    }

    // 取消修改
    const handleRenameCancel = () => {
        setRenameModalVisible(false)
        setRenameRoomId(null)
        setNewRoomName('')
    }

    const getRoomMenuItems = (item) => {
        const owner = isOwner(item)
        return [
            {
                label: '修改名称',
                disabled: !owner,
                onClick: () => handleRename(item.roomid, item.roomname)
            },
            {
                label: '回收',
                disabled: !owner,
                onClick: () => handleRecycle(item.roomid)
            }
        ]
    }

    return (
        <div className="room-container">
            <div className="room-header">
                <div className="room-tabs">
                    <button
                        className={`room-tab ${activeTab === 'related' ? 'active' : ''}`}
                        onClick={() => handleTabChange('related')}
                    >
                        自己相关
                    </button>
                    <button
                        className={`room-tab ${activeTab === 'created' ? 'active' : ''}`}
                        onClick={() => handleTabChange('created')}
                    >
                        你创建的
                    </button>
                </div>
                <div className="room-search">
                    <Input placeholder="输入工作区名称"
                        style={{ width: '200px' }}
                        value={inputValue}
                        onChange={handleChange}
                    />
                    <Button icon={<SearchOutlined />}
                        style={{ marginLeft: '5px', background: '#bfbfbf' }}
                        onClick={handleClick}
                    >查询
                    </Button>
                </div>
            </div>

            <PopForm isOpen={isShow} onClose={close}>
                <Form
                    form={form}
                    name="wrap"
                    labelCol={{ flex: '500px' }}
                    labelAlign="left"
                    labelWrap
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    wrapperCol={{ flex: 1 }}
                    colon={false}
                >
                    <Form.Item label="名字" name="roomname" >
                        <Input readOnly />
                    </Form.Item>
                    <Form.Item label=" ">
                        <Button type="primary" htmlType="submit" className="buildButton">
                            确认
                        </Button>
                    </Form.Item>
                </Form>
            </PopForm>

            {(roomList && roomList.length > 0) ? (
                <>
                    <div className="roomList">
                        {roomList.map((item) => {
                            if (item && item.roomid && item.roomname) {
                                return (
                                    <div key={item.roomid} className="room-item" onClick={() => roomClick(item.roomid, item.roomname)}>
                                        <RoomActionMenu items={getRoomMenuItems(item)} />
                                        <img src={work} alt="Document" className="room-img" />
                                        <span>{item.roomname}</span>
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                    <div className="pagination-container">
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={pagination.total}
                            onChange={handlePageChange}
                            showSizeChanger
                            showQuickJumper
                            showTotal={(total) => `共 ${total} 个工作区`}
                            pageSizeOptions={['10', '20', '30', '50']}
                        />
                    </div>
                </>
            ) : (
                <img src={nullImg} alt="Null Image" className="null-img" />
            )}

            {/* 修改名称弹窗 */}
            <Modal
                title="修改工作区名称"
                open={renameModalVisible}
                onOk={handleRenameConfirm}
                onCancel={handleRenameCancel}
                okText="确认"
                cancelText="取消"
            >
                <Input
                    placeholder="请输入新的工作区名称"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    onPressEnter={handleRenameConfirm}
                />
            </Modal>

        </div>
    )
}

export default WorkPlaceManage

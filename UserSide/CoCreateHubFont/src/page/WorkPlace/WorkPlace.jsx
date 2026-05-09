import { HoleEditor } from "./Editor/CollaborativeEditor.jsx";
import './WorkPlace.css'
import logo from '@assets/logo.png'
import GroupIcon from '@mui/icons-material/Group';
import NoTi from '@mui/icons-material/NotificationsNone';
import Email from '@mui/icons-material/Email';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState, useRef } from "react";
import buildLogo from '@assets/buildLogo.svg'
import { useDispatch, useSelector } from "react-redux";
import { addDocList, fetchDocList, importDocList, renameDocList, deleteDocList } from "@page/store/reducers/doc.js";
import { Button, Form, Input, message, Tooltip, Avatar } from "antd";
import { PopForm } from "@page/component/Form.jsx";
import { sendInviteTokensApi } from "../api/mate.js";
import FileActionModal from "./FileActionModal.jsx";
import FileImport from "./FileImport.jsx";
import FileList from "./FileList.jsx";
import TaskList from "./TaskList.jsx";
import AnnouncementPanel from "./AnnouncementPanel.jsx";

// 在线用户头像组件
const DocOnlineAvatars = ({ users }) => {
    if (!users || users.length === 0) return null
    return (
        <div className="onlineAvatars">
            {users.map((user, i) => (
                <Tooltip title={user.name || '匿名用户'} key={`avatar-${user.name || 'anonymous'}-${i}`}>
                    <Avatar
                        size={32}
                        style={{
                            backgroundColor: user.color || '#1890ff',
                            marginLeft: i > 0 ? -8 : 0,
                            border: '2px solid #000',
                            cursor: 'default'
                        }}
                    >
                        {user.name?.[0]?.toUpperCase() || '?'}
                    </Avatar>
                </Tooltip>
            ))}
        </div>
    )
}
//成员模块
const MemberModule = ({ onlineUsers, username, roomid }) => {
    // if (!onlineUsers || onlineUsers.length === 0) return null

    const [copied, setCopied] = useState(false);

    const sendInviteTokens = async () => {
        try {
            const res = await sendInviteTokensApi(username, roomid)
            if (res) {
                await navigator.clipboard.writeText(res)
                setCopied(true)
                message.success('复制成功')
                setTimeout(() => setCopied(false), 2000)
            }
        } catch (error) {
            message.error('生成邀请链接失败')
        }
    }

    return (
        <div className="memberMod">
            <span className="memberModTitle">文件内成员</span>
            <div className="memberGrid">
                {onlineUsers && onlineUsers.map((user, i) => (
                    <Tooltip title={user.name || '匿名用户'} key={`member-${user.name || 'anonymous'}-${i}`}>
                        <div className="memberItem">
                            <div className="memberAvatarWrap">
                                <Avatar
                                    size={28}
                                    style={{ backgroundColor: user.color || '#1890ff' }}
                                >
                                    {user.name?.[0]?.toUpperCase() || '?'}
                                </Avatar>
                                <span className="memberOnlineDot" />
                            </div>
                        </div>
                    </Tooltip>
                ))}
            </div>
            <button className="inviteBt" onClick={sendInviteTokens}>
                {copied ? '已复制' : '复制邀请链接'}
            </button>
        </div>
    )
}
//工作区主程序，房间id，key设置。。。
const WorkPlace = ({ docroomid }) => {
    const [form] = Form.useForm();
    const [isShow, setIsShow] = useState(false);
    const [isActionModalVisible, setIsActionModalVisible] = useState(false);
    const [isImportModalVisible, setIsImportModalVisible] = useState(false);
    const [isFileListVisible, setIsFileListVisible] = useState(false);
    const [isFileListHovered, setIsFileListHovered] = useState(false);
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    const [isFileListClosing, setIsFileListClosing] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [selectedDoc, setSelectedDoc] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [pendingImportContent, setPendingImportContent] = useState(null)
    const { docList } = useSelector(state => state.doc)
    const { uname } = useSelector(state => state.user)

    // 公告面板引用
    const announcementPanelRef = useRef(null)


    const handleOnlineUsersChange = useCallback((users) => {
        setOnlineUsers(users)
    }, [])

    // 处理任务变更，刷新通知
    const handleTaskChange = useCallback(() => {
        if (announcementPanelRef.current && announcementPanelRef.current.refreshNotifications) {
            announcementPanelRef.current.refreshNotifications()
        }
    }, [])

    const onFinish = async (value) => {
        const data = {
            ...value,
            docroomid
        }
        console.log(data)
        const addedDoc = await dispatch(addDocList(data))
        if (addedDoc && addedDoc.docid) {
            setSelectedDoc(addedDoc.docid)
        }
        form.resetFields();
        close()
        message.success('成功创建文件')
    }
    const onFinishFailed = (errorInfo) => {
        message.error("请检查文件信息是否正确！");
        console.error("表单验证失败:", errorInfo);
    };

    const show = () => setIsShow(true)
    const close = () => setIsShow(false)

    const showActionModal = () => setIsActionModalVisible(true)
    const closeActionModal = () => setIsActionModalVisible(false)

    const handleNewFile = () => {
        closeActionModal()
        show()
    }

    const handleImportFile = () => {
        closeActionModal()
        setIsImportModalVisible(true)
    }

    const handleImport = async (data) => {
        // 提取导入内容
        const { importContent, ...docData } = data;

        // 先创建文档
        const addedDoc = await dispatch(importDocList(docData))
        if (addedDoc && addedDoc.docid) {
            setSelectedDoc(addedDoc.docid)
            // 设置待插入的内容
            if (importContent) {
                setPendingImportContent(importContent)
            }
        }
        message.success('文件导入成功')
    }

    const handleRename = async (docid, newName) => {
        try {
            await dispatch(renameDocList(docid, newName))
            message.success('文件重命名成功')
        } catch (error) {
            message.error('文件重命名失败')
            console.error(error)
        }
    }

    const handleDelete = async (docid) => {
        try {
            await dispatch(deleteDocList(docid))
            message.success('文件删除成功')
            if (selectedDoc === docid) {
                setSelectedDoc(null)
            }
        } catch (error) {
            message.error('文件删除失败')
            console.error(error)
        }
    }

    const toggleFileList = () => {
        setIsFileListVisible(!isFileListVisible)
    }

    // 处理鼠标进入按钮区域
    const handleButtonMouseEnter = () => {
        setIsButtonHovered(true)
        setIsFileListVisible(true)
    }

    // 处理鼠标离开按钮区域
    const handleButtonMouseLeave = () => {
        setIsButtonHovered(false)
    }

    // 处理鼠标进入文件栏
    const handleFileListMouseEnter = () => {
        setIsFileListHovered(true)
    }

    // 处理鼠标离开文件栏
    const handleFileListMouseLeave = () => {
        setIsFileListHovered(false)
        setIsFileListClosing(true)
        // 等待动画完成后再隐藏
        setTimeout(() => {
            setIsFileListVisible(false)
            setIsFileListClosing(false)
        }, 300) // 与CSS动画时间一致
    }

    useEffect(() => {
        dispatch(fetchDocList(docroomid))
    }, [dispatch, docroomid])

    function docChoose(docid) {
        setSelectedDoc(docid)
    }
    return (
        <div className="workPlace">
            <MemberModule onlineUsers={onlineUsers} username={uname} roomid={docroomid} />
            <TaskList roomId={docroomid} onTaskChange={handleTaskChange} />
            {!uname && (
                <div className="enterOverlay">
                    <div className="enterModal">
                        <div className="enterSpinner" />
                        <span>正在进入协作空间...</span>
                    </div>
                </div>
            )}
            <div style={{ filter: !uname ? 'blur(6px)' : 'none', transition: 'filter 0.3s', width: '100%', height: '100%' }}>
                {/*弹窗*/}
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
                        <Form.Item label="文件名称" name="docname" rules={[{ required: true, message: "名称不能为空" }]}>
                            <Input placeholder="请输入文件名称" />
                        </Form.Item>


                        <Form.Item label=" ">
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="buildButton"
                            // onClick={()=>build(form.getFieldsValue("docname"))}
                            >
                                创建
                            </Button>
                        </Form.Item>
                    </Form>
                </PopForm>

                {/* 文件操作选择弹窗 */}
                <FileActionModal
                    visible={isActionModalVisible}
                    onClose={closeActionModal}
                    onNewFile={handleNewFile}
                    onImportFile={handleImportFile}
                />

                {/* 文件导入弹窗 */}
                <FileImport
                    visible={isImportModalVisible}
                    onClose={() => setIsImportModalVisible(false)}
                    onImport={handleImport}
                    docroomid={docroomid}
                />
                {/*头部*/}
                <div className="editorHead">
                    <img src={logo} alt={logo} onClick={() => { navigate(-1) }} />
                    <span className="cch-title" style={{ fontSize: '26px' }} onClick={() => { navigate('/') }}>CoCreateHub</span>
                    <div className="mesAuser">
                        <div className="mes">
                            <div className="AnnouncementPanel"><AnnouncementPanel ref={announcementPanelRef} roomid={docroomid} /></div>
                            <div className="email"><Email /></div>
                        </div>
                        <div className="user" onClick={() => navigate('/User')}><GroupIcon /></div>
                    </div>
                </div>
                {/*doc列表*/}
                {isFileListVisible && (
                    <div
                        className={isFileListClosing ? 'file-list-wrapper closing' : 'file-list-wrapper'}
                        onMouseEnter={handleFileListMouseEnter}
                        onMouseLeave={handleFileListMouseLeave}
                    >
                        <FileList
                            docList={docList}
                            selectedDoc={selectedDoc}
                            onDocSelect={docChoose}
                            onNewFile={showActionModal}
                            onRename={handleRename}
                            onDelete={handleDelete}
                        />
                    </div>
                )}

                {/* 新建文件按钮 */}
                <div
                    className="new-file-button"
                    onClick={showActionModal}
                    onMouseEnter={handleButtonMouseEnter}
                    onMouseLeave={handleButtonMouseLeave}
                >
                    <svg className="new-file-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                    <span className="new-file-text">新建</span>
                </div>

                {/*doc编辑页面*/}
                {
                    selectedDoc ?
                        (<HoleEditor
                            docId={selectedDoc}
                            editorId={uname}
                            onOnlineUsersChange={handleOnlineUsersChange}
                            pendingImportContent={pendingImportContent}
                            onImportContentInserted={() => setPendingImportContent(null)}
                        />) :
                        null
                }
            </div>{/* end blur wrapper */}
        </div>
    )
}

export default WorkPlace

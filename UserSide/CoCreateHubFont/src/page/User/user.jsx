import './user.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import FolderIcon from '@mui/icons-material/Folder';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, editUser, logoutUser } from "@page/store/reducers/user.js";
import { message } from "antd";

const User = () => {

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [open, setOpen] = useState(false);
    const [workspaceRetention, setWorkspaceRetention] = useState(30); // 工作区保存天数
    const [fileRetention, setFileRetention] = useState(90); // 文件保存天数

    const navigate = useNavigate();
    const { uname, mail, logo } = useSelector(state => state.user);
    const dispatch = useDispatch()

    const handleClickOpen = () => {
        setName(uname || '');
        setEmail(mail || '');
        setPassword('');
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = async () => {
        const userData = {
            uname: name,
            mail: email,
            ...(password && { password: password }),
            logo: avatar
        }
        console.log('保存个人信息：', userData)
        await dispatch(editUser(userData))
        message.success('信息更新成功')
        handleClose();
    };

    const [avatar, setAvatar] = useState(null);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogout = () => {
        dispatch(logoutUser())
        navigate('/')
    }

    const handleDelete = () => {
        dispatch(deleteUser())
        navigate('/')
        message.success("账号已注销")
    }

    const handleSaveRetention = () => {
        // TODO: 调用API保存保留时间设置
        message.success('保存时间设置已更新')
    }

    return (
        <div className="userSetting">
            <div className="userTop">
                <button className="backButton" onClick={() => navigate(-1)}>
                    <ArrowBackIcon />
                </button>
                <span className="pageTitle">用户设置</span>
            </div>

            <div className="settingsContainer">
                {/* 用户信息卡片 */}
                <div className="settingCard userInfoCard">
                    <div className="cardHeader">
                        <GroupIcon className="cardIcon" />
                        <h3>个人信息</h3>
                    </div>
                    <div className="cardContent">
                        <div className="userProfile">
                            <div className="userAvatar">
                                {logo ? <img src={logo} alt="avatar" /> : <GroupIcon />}
                            </div>
                            <div className="userInfo">
                                <div className="infoItem">
                                    <span className="infoLabel">用户名</span>
                                    <span className="infoValue">{uname}</span>
                                </div>
                                <div className="infoItem">
                                    <span className="infoLabel">邮箱</span>
                                    <span className="infoValue">{mail}</span>
                                </div>
                            </div>
                            <button className="editButton" onClick={handleClickOpen}>
                                编辑信息
                            </button>
                        </div>
                    </div>
                </div>

                {/* 工作区管理卡片 */}
                <div className="settingCard">
                    <div className="cardHeader">
                        <WorkspacesIcon className="cardIcon" />
                        <h3>工作区管理</h3>
                    </div>
                    <div className="cardContent">
                        <div className="settingItem">
                            <div className="settingInfo">
                                <span className="settingLabel">工作区保存时间</span>
                                <span className="settingDesc">回收站中的工作区将在设定天数后自动删除</span>
                            </div>
                            <div className="settingControl">
                                <FormControl variant="outlined" size="small" className="retentionSelect">
                                    <Select
                                        value={workspaceRetention}
                                        onChange={(e) => setWorkspaceRetention(e.target.value)}
                                    >
                                        <MenuItem value={7}>7 天</MenuItem>
                                        <MenuItem value={15}>15 天</MenuItem>
                                        <MenuItem value={30}>30 天</MenuItem>
                                        <MenuItem value={60}>60 天</MenuItem>
                                        <MenuItem value={90}>90 天</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <div className="settingDivider"></div>
                        <div className="settingActions">
                            <button className="saveButton" onClick={handleSaveRetention}>
                                保存设置
                            </button>
                        </div>
                    </div>
                </div>

                {/* 文件管理卡片 */}
                <div className="settingCard">
                    <div className="cardHeader">
                        <FolderIcon className="cardIcon" />
                        <h3>文件管理</h3>
                    </div>
                    <div className="cardContent">
                        <div className="settingItem">
                            <div className="settingInfo">
                                <span className="settingLabel">文件保存时间</span>
                                <span className="settingDesc">回收站中的文件将在设定天数后自动删除</span>
                            </div>
                            <div className="settingControl">
                                <FormControl variant="outlined" size="small" className="retentionSelect">
                                    <Select
                                        value={fileRetention}
                                        onChange={(e) => setFileRetention(e.target.value)}
                                    >
                                        <MenuItem value={7}>7 天</MenuItem>
                                        <MenuItem value={15}>15 天</MenuItem>
                                        <MenuItem value={30}>30 天</MenuItem>
                                        <MenuItem value={60}>60 天</MenuItem>
                                        <MenuItem value={90}>90 天</MenuItem>
                                        <MenuItem value={180}>180 天</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <div className="settingDivider"></div>
                        <div className="settingActions">
                            <button className="saveButton" onClick={handleSaveRetention}>
                                保存设置
                            </button>
                        </div>
                    </div>
                </div>

                {/* 联系我们卡片 */}
                <div className="settingCard">
                    <div className="cardHeader">
                        <ContactSupportIcon className="cardIcon" />
                        <h3>联系我们</h3>
                    </div>
                    <div className="cardContent">
                        <div className="contactItem">
                            <span className="contactLabel">常见问题</span>
                            <button className="linkButton">查看 →</button>
                        </div>
                        <div className="settingDivider"></div>
                        <div className="contactItem">
                            <span className="contactLabel">反馈与建议</span>
                            <button className="linkButton">提交 →</button>
                        </div>
                    </div>
                </div>

                {/* 账号操作 */}
                <div className="accountActions">
                    <button className="dangerButton" onClick={handleDelete}>
                        注销账号
                    </button>
                    <button className="primaryButton" onClick={handleLogout}>
                        退出登录
                    </button>
                </div>
            </div>

            {/* 编辑信息对话框 */}
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        backgroundColor: '#1a1a1b',
                        color: '#fff',
                        minWidth: '400px'
                    }
                }}
            >
                <DialogTitle style={{ borderBottom: '1px solid #333' }}>
                    编辑个人信息
                </DialogTitle>
                <DialogContent style={{ paddingTop: '20px' }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="用户名"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        InputLabelProps={{ style: { color: '#999' } }}
                        InputProps={{ style: { color: '#fff' } }}
                    />
                    <TextField
                        margin="dense"
                        label="邮箱"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        InputLabelProps={{ style: { color: '#999' } }}
                        InputProps={{ style: { color: '#fff' } }}
                    />
                    <TextField
                        margin="dense"
                        label="新密码（留空则不修改）"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputLabelProps={{ style: { color: '#999' } }}
                        InputProps={{ style: { color: '#fff' } }}
                    />
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="contained-button-file"
                        type="file"
                        onChange={handleAvatarChange}
                    />
                    <label htmlFor="contained-button-file" style={{ marginTop: '16px', display: 'block' }}>
                        <Button
                            variant="outlined"
                            component="span"
                            style={{
                                color: '#4cc9f0',
                                borderColor: '#4cc9f0',
                                width: '100%'
                            }}
                        >
                            上传头像
                        </Button>
                    </label>
                </DialogContent>
                <DialogActions style={{ borderTop: '1px solid #333', padding: '16px' }}>
                    <Button onClick={handleClose} style={{ color: '#999' }}>
                        取消
                    </Button>
                    <Button
                        onClick={handleSave}
                        style={{
                            backgroundColor: '#4cc9f0',
                            color: '#000',
                            fontWeight: 'bold'
                        }}
                    >
                        保存
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default User;

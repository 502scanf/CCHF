import './user.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';

const User = ()=>{

    const [email, setEmail] = useState("1234567890@qq.com");
    const [name, setname] = useState("User123");
    const [password,setpassword] = useState("1234566789");
    const [notifications, setNotifications] = useState(false);
    const [disturb, setDisturb] = useState(true);

    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        console.log('保存个人信息：', { name, email });
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

    return (
        <div className="userSetting">
            <div className="userTop">
                <button className="backButton" onClick={backFunction}><ArrowBackIcon /></button>
                <span>用户设置</span>
            </div>
            <div className="Option">
                <h3>
                    基本设置
                </h3>
                <hr/>
                    <div className="UserInfo">
                        <image className="userLogo"><GroupIcon/></image>
                        <div className="userDetails">
                            <span className="spanHead">用户名: {name}</span>
                            <span className="spanHead">邮箱: {email}</span>
                        </div>
                        <button variant="contained" color="primary" onClick={handleClickOpen}>编辑信息</button>
                        <Dialog classes="InfoEdit" open={open} onClose={handleClose}>
                            <DialogTitle>编辑个人信息</DialogTitle>
                            <DialogContent>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="姓名"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <TextField
                                    margin="dense"
                                    label="邮箱"
                                    type="email"
                                    fullWidth
                                    variant="outlined"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <TextField
                                    margin="dense"
                                    label="新密码"
                                    type="password"
                                    fullWidth
                                    variant="outlined"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="contained-button-file"
                                    multiple
                                    type="file"
                                    onChange={handleAvatarChange}
                                />
                                <label htmlFor="contained-button-file">
                                    <Button variant="contained" component="span">
                                        上传头像
                                    </Button>
                                </label>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose} color="secondary">
                                    退出
                                </Button>
                                <Button onClick={handleSave} color="primary">
                                    保存
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
            </div>
            <div className="Option">
                <h3>
                    消息设置
                </h3>
                <hr/>
                    <div className="Inform">
                        <div className="messageOption">
                            <span className="spanHead">消息免打扰</span>
                            <label className="switch">
                                <input type="checkbox" checked={notifications}
                                       onChange={() => setNotifications(!notifications)}/>
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <div className="messageOption">
                            <span className="spanHead">消息通知</span>
                            <label className="switch">
                                <input type="checkbox" checked={disturb} onChange={() => setDisturb(!disturb)}/>
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
            </div>
            <div className="Option">
                <h3>
                    文件管理
                </h3>
                <hr/>
                    <div className="Inform">
                        <div className="fileOption">
                            <span className="spanHead">工作文件的处理设置</span>
                        </div>
                        <div className="fileOption">
                            <span className="spanHead">设置文件保存时间</span>
                        </div>
                        <div className="fileOption">
                            <span className="spanHead">清理缓存文件</span>
                        </div>
                    </div>
            </div>
            <div className="Option">
                <h3>
                    联系我们
                </h3>
                <hr/>
                    <div className="Inform">
                        <div className="spanTip">
                            <span className="spanHead">常见问题</span>
                        </div>
                        <div className="spanTip">
                            <span className="spanHead">反馈与建议</span>
                        </div>
                    </div>
            </div>
            <div className="Option">
                <button className="hover1">注销账号</button>
                <button className="hover2">退出登录</button>
            </div>
        </div>
    )
}

function backFunction() {

}

export default User;

import nullImg from "@assets/null.jpg";
import React, {useEffect, useState} from 'react'
import { useSelector,useDispatch } from 'react-redux'
import {fetchRoomList, getRoom} from "@page/store/reducers/room.js";
import "./WorkPlaceManage.css"
import doc from "@assets/doc.svg";
import work from "@assets/workPlace.svg";
import {useNavigate} from "react-router-dom";
import {Button, Input, message} from 'antd';
import {SearchOutlined} from "@ant-design/icons";

const WorkPlaceManage = () => {
    const navigate = useNavigate();
    const {roomList} = useSelector(state => state.room)
    const [inputValue,setInputValue] = useState('')
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(fetchRoomList())
    },[dispatch])

    // 处理输入框的值变化
    const handleChange = (e) => {
        setInputValue(e.target.value)
    }

    // 点击按钮时获取输入框的值
    const handleClick = async () => {
        // 检查输入框内容是否为空
        if (!inputValue.trim()) {
            message.warning('请输入工作区名称');
            return; // 阻止进一步操作
        }
        console.log('输入的内容是：', inputValue);
        try {
            await dispatch(getRoom(inputValue));
        } catch (error) {
            // 捕获错误并给出提示
            if (error.message) {
                message.error(error.message);
            } else {
                message.error('请求失败，请稍后再试');
            }
            console.error('Error:', error);
        }
    };

    return (
        <div className="room-container">
            <div className="room-header">
                <label style={{marginRight: '5px'}}>工作区名称：</label>
                <Input placeholder="输入工作区名称"
                       style={{width: '300px'}}
                       value={inputValue} // 将输入框的值绑定到状态
                       onChange={handleChange} // 监听输入框的值变化
                />
                <Button icon={<SearchOutlined/>}
                        style={{marginLeft: '5px', background: '#bfbfbf', color: ''}}
                        onClick={handleClick}
                >查询
                </Button>
            </div>

            {(roomList && roomList.length > 0) ? (
                <div className="roomList">
                    {roomList.map((item) => {
                        if (item && item.roomid && item.roomname) {
                            return (
                                <div key={item.roomid} className="room-item" onClick={() => navigate(`/work/${item.roomid}`)}>
                                    <img
                                        src={work}
                                        alt="Document"
                                        className="room-img"
                                    />
                                    <span>{item.roomname}</span>
                                </div>
                            );
                        }
                        return null; // 如果 item 为 null 或缺少属性，则不渲染
                    })}
                </div>
            ) : (
                <img src={nullImg} alt="Null Image" className="null-img"/>
            )}

        </div>
    )
}


export default WorkPlaceManage
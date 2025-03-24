import nullImg from "@assets/null.jpg";
import React, { useEffect } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import {fetchRoomList} from "@page/store/reducers/room.js";
import "./WorkPlaceManage.css"
import doc from "@assets/doc.svg";
import {useNavigate} from "react-router-dom";
import {Button, Input} from 'antd';
import {SearchOutlined} from "@ant-design/icons";

const WorkPlaceManage = () => {
    const navigate = useNavigate();
    const {roomList} = useSelector(state => state.room)
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(fetchRoomList())
    },[dispatch])

    return (
        <div className="room-container">
            <div className="room-header">
                <label style={{marginRight:'5px'}}>工作区名称：</label>
                <Input placeholder="输入工作区名称" style={{ width: '300px' }}/>
                <Button icon={<SearchOutlined />} style={{ marginLeft: '5px',background:'#bfbfbf',color: ''}}>查询</Button>
            </div>
            {roomList ? (
                <div className="roomList">
                    {roomList.map((item) => (
                        <div key={item.roomid} className="room-item" onClick={() => navigate(`/work/${item.roomid}`)}>
                            <img
                                src={doc}
                                alt="Document"
                                className="room-img"
                            />
                            <span>{item.roomname}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <img src={nullImg} alt="Null Image" className="null-img" />
            )}

        </div>
    )
}


export default WorkPlaceManage
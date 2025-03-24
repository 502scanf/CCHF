import nullImg from "@assets/null.jpg";
import React, { useEffect } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import {fetchRoomList} from "@page/store/reducers/room.js";
import "./WorkPlaceManage.css"
import doc from "@assets/doc.svg";
import {useNavigate} from "react-router-dom";

const WorkPlaceManage = () => {
    const navigate = useNavigate();
    const {roomList} = useSelector(state => state.room)
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(fetchRoomList())
    },[dispatch])

    return (
        <div className="room-container">
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
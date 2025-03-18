import nullImg from "@assets/null.jpg";
import React, { useEffect } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import {fetchRoomList} from "@page/store/reducers/room.js";
import "./WorkPlaceManage.css"
import doc from "@assets/doc.svg";

const WorkPlaceManage = () => {
    const {roomList} = useSelector(state => state.room)
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(fetchRoomList())
    },[dispatch])

    return (
        <div className="room-container">
            {roomList ? (
                <div className="roomList">
                    {roomList.map((item,index) => (
                        <div key={index} className="room-item">
                            <img
                                src={doc}
                                alt="Document"
                                className="room-img"
                            />
                            <span>{item.roomid}</span>
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
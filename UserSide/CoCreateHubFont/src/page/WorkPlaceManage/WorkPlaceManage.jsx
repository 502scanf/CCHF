import nullImg from "@assets/null.jpg";
import { useEffect } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import {fetchRoomList} from "@page/store/reducers/room.js";
import "./WorkPlaceManage.css"

const WorkPlaceManage = () => {
    const {roomList} = useSelector(state => state.room)
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(fetchRoomList())
        },[dispatch])
    return(
        <div className="room-container">
            {
                roomList ?
                <ul>{roomList.map(item => (<li key={item.id}>{item.name}</li>))}</ul> :
                <img src={nullImg} alt="Null Image" className="null-img"/>
            }
        </div>
    )
}


// const WorkPlaceManage = () => {
//     return(
//         <img src={nullImg} alt="Null Image" className="null-img"/>
//     )
// }

export default WorkPlaceManage
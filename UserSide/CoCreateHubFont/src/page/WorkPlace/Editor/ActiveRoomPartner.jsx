import {useOthers} from "@liveblocks/react/suspense";
import logo from '@assets/logo.png'
import '../WorkPlace.css'
export const ActiveRoomPartner = async () =>{

    const others = useOthers();
    const roomPartner = others.map(
        (other) => (
            other.info
        )
    )
    console.log(roomPartner)
    return(
        <ul className="partnerList">

        </ul>
    )
}

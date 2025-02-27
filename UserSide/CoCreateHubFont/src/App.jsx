
import WorkPlace from "./page/WorkPlace/WorkPlace.jsx";
import {useParams} from "react-router-dom";

export default function App(){
    const params = useParams()
    const id = params.roomId
    return(
        <div>
            <WorkPlace roomId={id}/>
        </div>

    )
}

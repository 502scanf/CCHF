
import {HoleEditor} from "./Editor/CollaborativeEditor.jsx";
import './WorkPlace.css'
import logo from  '@assets/logo.png'
import GroupIcon from '@mui/icons-material/Group';
import NoTi from '@mui/icons-material/NotificationsNone';
import Email from '@mui/icons-material/Email';
import {useNavigate} from 'react-router-dom';
//工作区主程序，房间id，key设置。。。
const WorkPlace = ({roomId})=>{

    const navigate = useNavigate();
    return (
        <div className="workPlace">
            <div className="editorHead">
                <img src={logo} alt={logo} />
                <span >CoCreateHub</span>
                <div className="mesAuser">
                    <div className="mes">
                        <NoTi/>
                        <Email/>
                    </div>
                    <div className="user" onClick={() => navigate('/User')}><GroupIcon/></div>
                </div>
            </div>
            <HoleEditor roomId={roomId}/>
        </div>
    )
}

export default WorkPlace

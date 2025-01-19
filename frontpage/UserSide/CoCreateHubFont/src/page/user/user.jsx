import './User.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GroupIcon from '@mui/icons-material/Group';
const User = ()=>{
    return (
        <div className="userSetting">
            <div className="userTop">
               <button className="backButton" onClick={backFunction}><ArrowBackIcon/></button>
                <span>用户设置</span>
            </div>
            <div className="Setting">
                <div className="Inform">
                    <div className="userLogo"><GroupIcon/></div>
                    <span className="spanHead">1234567890@qq.com</span>
                    <button>编辑信息</button>
                </div>
                <div className="Inform">
                    <div className="spanTip">
                        <span className="spanHead">文件管理</span>
                        <span>对工作文件的处理设置，设置文件的保存时间,我们推荐定时清理完成文件</span>
                    </div>

                </div>
                <div className="Inform">
                    <div className="spanTip">
                        <span className="spanHead">帮助与支持</span>
                        <span>常见问题,查看常见问题解答;反馈与建议,提交反馈或建议。</span>
                    </div>
                </div>
                <div className="Inform DelOutBut">
                    <button className="hover1">注消</button>
                    <button className="hover2">登出</button>
                </div>
            </div>
        </div>
    )
}

function backFunction(){

}
export default User

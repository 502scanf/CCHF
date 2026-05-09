import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import './Invite.css'
import { getToken } from '@page/util/token.js';
import { DisabledByDefaultOutlined, NavigateNextSharp } from '@mui/icons-material';
import { confirmInviteApi } from '@page/api/mate.js';
import { message } from 'antd';
//邀请模块
const Invite = () => {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const userToken = getToken();
    //从加密token中获取payload非加密部分
    const playload = token.split('.')[1]
    const json = atob(playload)
    const tokenJson = JSON.parse(json)

    if (!userToken) {
        const currentPath = `/invite?token=${token}`
        return <Navigate to={`/login?redirect=${encodeURIComponent(currentPath)}`} replace />
    }

    const confirmInvite = async () => {
        try {
            await confirmInviteApi(token)
            navigate('/workPlace')
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // 显示未登录提示
                message.error('未登录或登录已过期，请重新登录')
                // 清除本地 token
                localStorage.removeItem('token')
                // 延迟跳转，让提示显示出来
                setTimeout(() => {
                    const currentPath = `/invite?token=${token}`
                    navigate(`/login?redirect=${encodeURIComponent(currentPath)}`)
                }, 1500)
            } else {
                // 显示后端返回的错误信息
                const errorMsg = error.response?.data?.msg || error.response?.data?.message || error.message || '加入房间失败'
                message.error(`加入房间失败: ${errorMsg}`)
                console.error('确认邀请失败:', error)
            }
        }
    }
    return (
        <div className='InviteBack'>
            <div className='InviteWin'>
                <span className='cch-title'>CoCreateHub</span>
                <span className='inviteDetail'>{tokenJson.userName}    邀请你加入 {tokenJson.roomName} 房间</span>
                <button onClick={() => confirmInvite()}>确认</button>
            </div>
        </div>
    );
};

export default Invite;
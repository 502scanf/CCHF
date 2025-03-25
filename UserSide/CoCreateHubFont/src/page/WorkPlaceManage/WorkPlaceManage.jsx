import nullImg from "@assets/null.jpg";
import React, {useEffect, useState} from 'react'
import { useSelector,useDispatch } from 'react-redux'
import {fetchRoomList, getRoom} from "@page/store/reducers/room.js";
import "./WorkPlaceManage.css"
import doc from "@assets/doc.svg";
import work from "@assets/workPlace.svg";
import {useNavigate} from "react-router-dom";
import {Button, Form, Input, message, theme} from 'antd';
import {SearchOutlined} from "@ant-design/icons";
import {PopForm} from "@page/component/Form.jsx";
import {passRoomApi} from "@page/api/room.js";

const WorkPlaceManage = () => {

    const [form] = Form.useForm();

    const navigate = useNavigate();
    const {roomList} = useSelector(state => state.room)
    const [inputValue,setInputValue] = useState('')
    const dispatch = useDispatch()
    const [selectRoomName, setSelectRoomName] = useState(null)
    const [selectRoomId, setSelectRoomId] = useState(null)

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

    const onFinish = async (value)=>{

        console.log(value)
        try{
            await passRoomApi(value)
            navigate(`/work/${selectRoomId}`)

        }catch{
            message.error('失败')
        }

    }
    const onFinishFailed = (errorInfo) => {
        message.error("请检查工作区信息是否正确！");
        console.error("表单验证失败:", errorInfo);
    };
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [isShow, setIsShow] = useState(false);
    const show = () => setIsShow(true)

    const close = () => setIsShow(false)

    const roomClick = (roomid,roomname) => {
        show()
        setSelectRoomName(roomname)
        setSelectRoomId(roomid)
    }
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

            <PopForm isOpen={isShow} onClose={close}>
                <Form
                    form={form}
                    name="wrap"
                    labelCol={{ flex: '500px' }}
                    labelAlign="left"
                    labelWrap
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    wrapperCol={{ flex: 1 }}
                    colon={false}

                >
                    <Form.Item label="名字" name="roomname" >
                        <Input
                            defaultValue={selectRoomName}
                            readOnly
                        />
                    </Form.Item>

                    <Form.Item label="密码" name="roompassword" rules={[{ required: true, message: "密码不能为空"}]}>
                        <Input.Password placeholder="请输入房间的密码"/>
                    </Form.Item>

                    <Form.Item label=" ">
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="buildButton"
                        >
                            确认
                        </Button>
                    </Form.Item>
                </Form>
            </PopForm>


            {(roomList && roomList.length > 0) ? (
                <div className="roomList">
                    {roomList.map((item) => {
                        if (item && item.roomid && item.roomname) {
                            return (
                                <div key={item.roomid} className="room-item" onClick={()=>roomClick(item.roomid, item.roomname)}>
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
                <img src={nullImg} alt="Null Image" className="null-img" />
            )}

        </div>
    )
}


export default WorkPlaceManage

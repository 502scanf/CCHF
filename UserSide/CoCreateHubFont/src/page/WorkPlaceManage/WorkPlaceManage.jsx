import nullImg from "@assets/null.jpg";
import React, {useEffect, useState} from 'react'
import { useSelector,useDispatch } from 'react-redux'
import {addRoomList, fetchRoomList} from "@page/store/reducers/room.js";
import "./WorkPlaceManage.css"
import doc from "@assets/doc.svg";
import {useNavigate} from "react-router-dom";
import {Button, Form, Input, message, theme} from 'antd';
import {SearchOutlined} from "@ant-design/icons";
import {PopForm} from "@page/component/Form.jsx";
import {passRoomApi} from "@page/api/room.js";

const WorkPlaceManage = () => {

    const [form] = Form.useForm();

    const navigate = useNavigate();
    const {roomList} = useSelector(state => state.room)
    const dispatch = useDispatch()
    const [selectRoomName, setSelectRoomName] = useState(null)
    const [selectRoomId, setSelectRoomId] = useState(null)

    useEffect(()=>{
        dispatch(fetchRoomList())
    },[dispatch])

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
                <label style={{marginRight:'5px'}}>工作区名称：</label>
                <Input placeholder="输入工作区名称" style={{ width: '300px' }}/>
                <Button icon={<SearchOutlined />} style={{ marginLeft: '5px',background:'#bfbfbf',color: ''}}>查询</Button>
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

            {roomList ? (
                <div className="roomList">
                    {roomList.map((item) => (
                        <div key={item.roomid} className="room-item" onClick={()=>roomClick(item.roomid, item.roomname)}>
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

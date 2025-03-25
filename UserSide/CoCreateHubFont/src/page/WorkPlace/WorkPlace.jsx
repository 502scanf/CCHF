import {HoleEditor} from "./Editor/CollaborativeEditor.jsx";
import './WorkPlace.css'
import logo from  '@assets/logo.png'
import GroupIcon from '@mui/icons-material/Group';
import NoTi from '@mui/icons-material/NotificationsNone';
import Email from '@mui/icons-material/Email';
import {useNavigate} from 'react-router-dom';
import React, {useEffect, useState} from "react";
import buildLogo from '@assets/buildLogo.svg'
import buildLogo2 from '@assets/buildLogo2.svg'
import doc from '@assets/doc.svg'
import {useDispatch, useSelector} from "react-redux";
import {addDocList, fetchDocList} from "@page/store/reducers/doc.js";
import {DocItem} from "./Editor/component/index.jsx"
import {Button, Form, Input, message} from "antd";
import {PopForm} from "@page/component/Form.jsx";
import {ActiveRoomPartner} from "@page/WorkPlace/Editor/ActiveRoomPartner.jsx";

//工作区主程序，房间id，key设置。。。
const WorkPlace = ({docroomid})=>{
    const [form] = Form.useForm();
    const [isShow, setIsShow] = useState(false);
    const navigate = useNavigate();
    const [isDocListVisible, setIsDocListVisible] = useState(false);
    const dispatch = useDispatch();
    const [selectedDoc, setSelectedDoc] = useState(null)
    const {docList} = useSelector(state => state.doc)
    const onFinish = async (value)=>{
        const data = {
            ...value,
            docroomid
        }
        console.log(data)
        await dispatch(addDocList(data))
        const docId = String(form.getFieldsValue("docname"))
        setSelectedDoc(docId)
        form.resetFields();
        close()
        message.success('成功创建文件')
    }
    const onFinishFailed = (errorInfo) => {
        message.error("请检查文件信息是否正确！");
        console.error("表单验证失败:", errorInfo);
    };

    const show = () => setIsShow(true)
    const close = () => setIsShow(false)

    useEffect(()=>{
        dispatch(fetchDocList(docroomid))
    },[dispatch,docroomid])


    return (
        <div className="workPlace">
            {/*弹窗*/}
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
                    <Form.Item label="文件名称" name="docname" rules={[{ required: true, message: "名称不能为空"}]}>
                        <Input placeholder="请输入文件名称"/>
                    </Form.Item>


                    <Form.Item label=" ">
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="buildButton"
                            // onClick={()=>build(form.getFieldsValue("docname"))}
                        >
                            创建
                        </Button>
                    </Form.Item>
                </Form>
            </PopForm>
            {/*头部*/}
            <div className="editorHead">
                <img src={logo} alt={logo} onClick={()=>{navigate(-1)}}/>
                <span onClick={()=>{navigate('/')}}>CoCreateHub</span>
                <div className="mesAuser">
                    <div className="mes">
                        <NoTi/>
                        <Email/>
                    </div>
                    <div className="user" onClick={() => navigate('/User')}><GroupIcon/></div>
                </div>
            </div>
            {/*doc列表*/}
            <div className="doc">
                <div
                    className="docList"
                    style={{
                        transform: isDocListVisible ? 'translateX(0)' : 'translateX(-100%)',
                        overflowY: 'auto',
                        maxHeight: '660px'
                    }}
                    onMouseEnter={() => setIsDocListVisible(true)}
                    onMouseLeave={() => setIsDocListVisible(false)}
                >
                    {docList && docList.map(item =>{
                        return(
                            <DocItem
                                onClick={()=>setSelectedDoc(item.docname)}
                            >
                                <img
                                    src={doc}
                                    alt={doc}
                                />
                                <span>{item.docname}</span>
                            </DocItem>
                        )
                    })}
                    <DocItem
                        onClick={()=>show()}
                    >
                        <img
                            src={buildLogo2}
                            alt={buildLogo2}
                        />
                        <span>新建文件</span>
                    </DocItem>

                </div>
                {/*创建logo*/}
                <div>
                    <img
                        src={buildLogo}
                        alt={logo}
                        className="buildLogo"
                        onMouseEnter={() => setIsDocListVisible(true)}
                        onMouseLeave={() => setIsDocListVisible(false)}
                        onClick={()=>show()}
                    />
                </div>
            </div>

            {/*doc编辑页面*/}
            {
                selectedDoc?
                (<HoleEditor docId={selectedDoc}/>):
                null
            }
        </div>
    )
}

export default WorkPlace

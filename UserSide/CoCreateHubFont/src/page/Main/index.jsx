import {Layout, theme, Form, Input, Button, message} from 'antd';
import {Outlet, useNavigate} from "react-router-dom";
import CommonAside from "./component/commonAside/index.jsx";
import CommonHeader from "./component/commonHeader/index.jsx";
import { useSelector } from "react-redux";
import  './Main.css'
import React, {useState} from "react";
import {PopForm} from "@page/component/Form.jsx";

const { Content } = Layout;

const Main = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const toWork = () => {
        const inputValue = form.getFieldValue("roomname");
        if (inputValue && inputValue.trim()) {
            navigate(`/work/${inputValue}`);
        } else {
            alert("请输入内容！");
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
    //获取折叠按钮的状态->true或false
    const collapsed = useSelector((state) => state.tab.isCollapsed);

    return (
        <div className="main">
            <PopForm isOpen={isShow} onClose={close}>
                <Form
                    form={form}
                    name="wrap"
                    labelCol={{ flex: '500px' }}
                    labelAlign="left"
                    labelWrap
                    onFinishFailed={onFinishFailed}
                    wrapperCol={{ flex: 1 }}
                    colon={false}

                >
                    <Form.Item label="名字" name="roomname" rules={[{ required: true, message: "名字不能为空"}]}>
                        <Input placeholder="请输入工作区名称"/>
                    </Form.Item>

                    <Form.Item label="备注" name="tip" rules={[{ required: true, message: "备注不能为空"}]}>
                        <Input placeholder="请填写工作区备注"/>
                    </Form.Item>

                    <Form.Item label=" ">
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="buildButton"
                            onClick={()=>toWork(form.getFieldsValue("roomname"))}>
                            创建
                        </Button>
                    </Form.Item>
                </Form>
            </PopForm>
            <Layout className="main-container">
                <CommonAside collapsed={collapsed} setIsShow={show} />
                <Layout>
                    <CommonHeader collapsed={collapsed} />
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 10,
                            minHeight: 300,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,

                        }}
                    >
                        <Outlet/>
                    </Content>
                </Layout>
            </Layout>
        </div>

    );
}

export default Main;

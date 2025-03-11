import React, { useState } from "react";
import { Form, Input,   message } from "antd";
import './sign.css'
import logo from "@assets/logo.png";
import {useDispatch} from "react-redux";
import {signUser} from "@page/store/reducers/user.js";
import {useNavigate} from "react-router-dom"; // 引入图片

const Sign= () => {
    const [form] = Form.useForm();
    // const [autoLogin, setAutoLogin] = useState(false);

    const onFinishFailed = (errorInfo) => {
        message.error("请检查表单信息是否正确！");
        console.error("注册失败:", errorInfo);
    };

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const onFinish = async (values)=>{
        console.log(values)
        await dispatch(signUser(values))
        navigate('/login')
        message.success('注册成功')
    }

    return (
        <div className="container">
            {/* 新增 logo 和标题部分 */}
            <div className="header-logo">
                <img src={logo} alt="Logo" className="header-logo-img" />
                <p className="header-title">CoCreateHub</p>
            </div>

            <div className="login-container">
                <p className="login-title">创建你的账号</p>
                <div className="login-form">
                    <Form
                        form={form}
                        name="loginForm"
                        layout="vertical"
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        onFinish={onFinish}
                        className="form"
                    >
                        <Form.Item
                            name="uname"
                            label="用户名"
                            rules={[
                                { required: true, message: "用户名不能为空" },
                            ]}
                        >
                            <Input placeholder="请输入用户名"/>
                        </Form.Item>
                        <Form.Item
                            name="mail"
                            label="邮箱"
                            rules={[
                                { required: true, message: "邮箱不能为空" },
                            ]}
                        >
                            <Input placeholder="请输入邮箱"/>
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="密码"
                            rules={[{ required: true, message: "密码不能为空" }]}
                        >
                            <Input.Password placeholder="请输入密码" />
                        </Form.Item>
                        <button className="custom-btn">
                            注册
                        </button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Sign;

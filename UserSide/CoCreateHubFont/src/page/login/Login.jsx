import React, { useState } from "react";
import { Form, Input,   message } from "antd";
import './Login.css'
import logo from "@assets/logo.png";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {fetchUser} from "@page/store/reducers/user.js"; // 引入图片

const Login= () => {
  const [form] = Form.useForm();
  // const [autoLogin, setAutoLogin] = useState(false);

  const onFinishFailed = (errorInfo) => {
    message.error("用户还没注册");
    console.error("登录失败:", errorInfo);
  };

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onFinish = async (value)=>{
    console.log(value)
    await dispatch(fetchUser(value))
    navigate('/')
    message.success('登录成功')
  }

  return (
    <div className="container">
      {/* 新增 logo 和标题部分 */}
      <div className="header-logo">
        <img src={logo} alt="Logo" className="header-logo-img" />
        <p className="header-title">CoCreateHub</p>
      </div>

      <div className="login-container">
        <p className="login-title">登录到协创空间</p>
        <div className="login-form">
          <span className="emailSpan">账号</span>
          <Form
            form={form}
            name="loginForm"
            layout="vertical"
            onFinishFailed={onFinishFailed}
            onFinish={onFinish}
            autoComplete="off"
            className="form"
          >
            <Form.Item
              name="login"
              label="邮箱/用户名"
              rules={[
                { required: true, message: "邮箱/用户名不能为空" },
              ]}
            >
              <Input placeholder="请输入邮箱/用户名" />
            </Form.Item>
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: "密码不能为空" }]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
            <button className="custom-btn">
              立即登录
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;

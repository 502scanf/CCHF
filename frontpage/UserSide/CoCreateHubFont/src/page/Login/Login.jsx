import React, { useState } from "react";
import { Form, Input, Checkbox, Button, message } from "antd";
import "./App.css";
import loginImage from "./assets/logo.png"; // 引入图片

const LoginForm = () => {
  const [form] = Form.useForm();
  const [autoLogin, setAutoLogin] = useState(false);

  const onFinishFailed = (errorInfo) => {
    message.error("请检查表单信息是否正确！");
    console.error("表单验证失败:", errorInfo);
  };

  return (
    <div className="container">
      {/* 新增 logo 和标题部分 */}
      <div className="header-logo">
        <img src={loginImage} alt="Logo" className="header-logo-img" />
        <p className="header-title">欢迎来到富文本编辑器</p>
      </div>

      <div className="login-container">
        <p className="login-title">Email</p>
        <div className="login-form">
          <Form
            form={form}
            name="loginForm"
            layout="vertical"
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className="form"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "邮箱不能为空" },
                { type: "email", message: "请输入有效的邮箱地址" },
              ]}
            >
              <Input placeholder="请输入邮箱" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "密码不能为空" }]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
            <Form.Item>
              <Button className="custom-btn" htmlType="submit" block>
                立即登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

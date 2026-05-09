import React, { useState } from "react";
import { Form, Input, message, Button } from "antd";
import './sign.css'
import logo from "@assets/logo.png";
import { useDispatch } from "react-redux";
import { signUser } from "@page/store/reducers/user.js";
import { useNavigate } from "react-router-dom";
import { sendCodeApi } from "@page/api/user.js";

const Sign = () => {
    const [form] = Form.useForm();
    const [countdown, setCountdown] = useState(0);
    const [sending, setSending] = useState(false);

    const onFinishFailed = (errorInfo) => {
        message.error("请检查表单信息是否正确！");
        console.error("注册失败:", errorInfo);
    };

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const onFinish = async (values) => {
        try {
            await dispatch(signUser(values))
            message.success('注册成功')
            navigate('/login')
        } catch (error) {
            message.error(error.message || '注册失败')
        }
    }

    // 发送验证码
    const handleSendCode = async () => {
        const email = form.getFieldValue('mail');

        if (!email) {
            message.warning('请先输入邮箱');
            return;
        }

        // 简单邮箱格式验证
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            message.error('邮箱格式不正确');
            return;
        }

        setSending(true);
        try {
            const res = await sendCodeApi(email);
            if (res.code === 1) {
                message.success('验证码已发送到您的邮箱');
                // 开始倒计时
                setCountdown(60);
                const timer = setInterval(() => {
                    setCountdown(prev => {
                        if (prev <= 1) {
                            clearInterval(timer);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            } else {
                message.error(res.msg || '发送失败');
            }
        } catch (error) {
            message.error('验证码发送失败，请稍后重试');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="container">
            {/* 新增 logo 和标题部分 */}
            <div className="header-logo">
                <img src={logo} alt="Logo" className="header-logo-img" />
                <p className="header-title cch-title">CoCreateHub</p>
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
                            <Input placeholder="请输入用户名" />
                        </Form.Item>

                        <Form.Item
                            name="mail"
                            label="邮箱"
                            rules={[
                                { required: true, message: "邮箱不能为空" },
                                { type: 'email', message: '邮箱格式不正确' }
                            ]}
                        >
                            <Input placeholder="请输入邮箱" />
                        </Form.Item>

                        {/* 验证码输入框 */}
                        <Form.Item
                            name="code"
                            label="验证码"
                            rules={[
                                { required: true, message: "验证码不能为空" },
                                { len: 4, message: '验证码为4位数字' }
                            ]}
                        >
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <Input
                                    placeholder="请输入验证码"
                                    maxLength={4}
                                    style={{ flex: 1 }}
                                />
                                <Button
                                    onClick={handleSendCode}
                                    disabled={countdown > 0 || sending}
                                    loading={sending}
                                    style={{
                                        backgroundColor: countdown > 0 ? '#666' : '#4cc9f0',
                                        color: '#fff',
                                        border: 'none',
                                        minWidth: '100px'
                                    }}
                                >
                                    {countdown > 0 ? `${countdown}秒后重试` : '发送验证码'}
                                </Button>
                            </div>
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

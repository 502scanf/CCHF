// eslint-disable-next-line no-unused-vars
import React from "react";
import {
    FieldTimeOutlined,
    HomeOutlined,
    ShareAltOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import './index.css'
import {useNavigate} from "react-router-dom";
import logo from  '@assets/logo.png'

const { Sider} = Layout;

// eslint-disable-next-line react/prop-types
const CommonAside = ({collapsed}) => {
    //实现菜单跳转
    const navigate = useNavigate();
    const selectMenu = (e) =>{
        console.log(e)
        navigate(e.key);
    }

    return (
        <Sider trigger={null} collapsed={collapsed} width={250}>
            <img src={logo} alt="React Logo" className="logo"/>
            {!collapsed&&<span className="app-name">CoCreateHub</span>}
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['/home']}
                items={[
                    {
                        key: '/newspace',
                        icon: <HomeOutlined />,
                        label: '新建工作区',
                    },
                    {
                        key: '/recent',
                        icon: <FieldTimeOutlined />,
                        label: '工作区管理',
                        children: [
                            {
                                key: '/recent/pageOne',
                                label: 'pageOne'
                            },
                            {
                                key: '/recent/pageTwo',
                                label: 'pageTwo'
                            }
                        ]
                    },
                    {
                        key: '/share',
                        icon: <ShareAltOutlined />,
                        label: '文件区',
                        children: [
                            {
                                key: '/recent/pageOne',
                                label: 'pageOne'
                            },
                            {
                                key: '/recent/pageTwo',
                                label: 'pageTwo'
                            }
                        ]
                    },
                    {
                        key: '/recycle',
                        icon: <HomeOutlined />,
                        label: '回收站',
                    },

                ]}
                style={{
                    height: '100%',
                    margin: '15px auto',

                }}
                onClick={selectMenu}
            />
        </Sider>
    )
}

export default CommonAside;

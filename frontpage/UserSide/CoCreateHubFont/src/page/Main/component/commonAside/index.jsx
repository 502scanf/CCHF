import React from "react";
import {
    FieldTimeOutlined,
    StarOutlined,
    HomeOutlined,
    ShareAltOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import './index.css'
import {useNavigate} from "react-router-dom";

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
        <Sider trigger={null} collapsed={collapsed}>
            <h3 className="app-name">协创空间</h3>
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['/home']}
                items={[
                    {
                        key: '/home',
                        icon: <HomeOutlined />,
                        label: '首页',
                    },
                    {
                        key: '/recent',
                        icon: <FieldTimeOutlined />,
                        label: '最近文档',
                    },
                    {
                        key: '/share',
                        icon: <ShareAltOutlined />,
                        label: '与我共享',
                    },
                    {
                        key: '/collection',
                        icon: <StarOutlined />,
                        label: '我的收藏',
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

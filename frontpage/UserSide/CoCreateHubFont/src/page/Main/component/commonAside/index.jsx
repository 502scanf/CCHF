import React from "react";
import {
    AppstoreAddOutlined,
    FieldTimeOutlined,
    DeleteOutlined,
    ShareAltOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import './index.css'
import {useNavigate} from "react-router-dom";
import logo from  '@assets/logo.png'

const { Sider} = Layout;

const CommonAside = ({collapsed , setIsShow}) => {
    //实现菜单跳转
    const navigate = useNavigate();

    const selectMenu = (e) =>{
        console.log(e)
        navigate(e.key);
    }

    return (
        <Sider trigger={null} collapsed={collapsed} width={250}>
            <div className="logoHead" onClick={()=>navigate('/Top')}>
                <img src={logo} alt="React Logo" className="logo"/>
                {!collapsed&&<span className="app-name">CoCreateHub</span>}
            </div>
            <div className="buildWork" onClick={() => setIsShow()}>
                <AppstoreAddOutlined/>
                {!collapsed&&<span> 新建工作区</span>}
            </div>
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['/workplacemanage']}
                items={[

                    {
                        key: '/workplacemanage',
                        icon: <FieldTimeOutlined />,
                        label: '工作区管理',

                    },
                    {
                        key: '/filespace',
                        icon: <ShareAltOutlined />,
                        label: '文件区',

                    },
                    {
                        key: '/recycle',
                        icon: <DeleteOutlined />,
                        label: '回收站',
                    },

                ]}
                style={{
                    height: '100%',
                    fontWeight:'bold'
                }}
                onClick={selectMenu}
            />
        </Sider>
    )
}

export default CommonAside;

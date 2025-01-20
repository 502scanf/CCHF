import { Layout, theme } from 'antd';
import {Outlet} from "react-router-dom";
import CommonAside from "./component/commonAside/index.jsx";
import CommonHeader from "./component/commonHeader/index.jsx";
import { useSelector } from "react-redux";
import  './Main.css'

const { Content } = Layout;

const Main = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    //获取折叠按钮的状态->true或false
    const collapsed = useSelector((state) => state.tab.isCollapsed);

    return (
        <Layout className="main-container">
            <CommonAside collapsed={collapsed} />
            <Layout>
                <CommonHeader collapsed={collapsed} />
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet/>
                </Content>
            </Layout>
        </Layout>
    );
}

export default Main;

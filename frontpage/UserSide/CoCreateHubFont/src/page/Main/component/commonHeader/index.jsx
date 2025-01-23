import { Button, Layout, Avatar, Dropdown} from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined,UserOutlined} from '@ant-design/icons';
import './index.css'
import { useDispatch } from 'react-redux';
import { collapseMenu } from '../../../store/reducers/tab.js'

const { Header } = Layout;

const CommonHeader = ({collapsed}) =>{
    const items = [
        {
            key: '1',
            label: (
                <a target="_self" rel="noopener noreferrer" href={'/User'}>
                    个人中心
                </a>
            ),
        },
        {
            key: '2',
            label: (
                <a target="_blank" rel="noopener noreferrer">
                    退出
                </a>
            ),
        },
    ];

    const dispatch = useDispatch();
    function setCollapse() {
        console.log(collapsed);
        dispatch(collapseMenu());
    }

    return (
        <Header className="header-container">
            <Button
                type="text"
                icon={collapsed?<MenuFoldOutlined />:<MenuUnfoldOutlined />}
                style={{
                    fontSize: '16px',
                    width: 32,
                    height: 32,
                    background: '#fff',
                }}
                onClick={setCollapse}
            />
            <Dropdown menu={{items}}>
                <Avatar size="large" icon={<UserOutlined />}/>
            </Dropdown>

        </Header>
    )
}

export default CommonHeader;

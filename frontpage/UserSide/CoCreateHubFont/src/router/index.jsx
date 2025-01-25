import User from '../page/User/User.jsx'
import {createBrowserRouter, Navigate, createHashRouter} from "react-router-dom";
import App from "../App.jsx";
import Main from "../page/Main/index.jsx";
import {Home} from "@mui/icons-material";
import Helper from "../page/User/Helper.jsx";
import Index from "@page/Top";
import Login from "@page/login/Login.jsx";

const router = createHashRouter([
    {
        path:'/top',
        element:<Index/>
    },
    {
        path:'/login',
        element: <Login/>
    },
    {
        path:'/',
        Component: Main,
        children:[
            //重定向
            {
                path: '/',
                element: <Navigate to="home" replace={true}/>
            },
            {
                path:'home',
                Component: Home
            },
            {
                path:'recent',
                Component: Home
            },
            {
                path:'share',
                Component: Home
            },
            {
                path:'collection',
                Component: Home
            },

        ]
    },
    {
        path:'/work/:roomId',
        element: <App/>
    },
    {
        path:'/User',
        element: <User/>
    },
    {
        path:'/Helper',
        element:<Helper/>
    },

])
export default router

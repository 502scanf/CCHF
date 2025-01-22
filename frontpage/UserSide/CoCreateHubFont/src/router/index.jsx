import User from '../page/User/User.jsx'
import {createBrowserRouter, Navigate} from "react-router-dom";
import App from "../App.jsx";
import Main from "../page/Main/index.jsx";
import {Home} from "@mui/icons-material";

const router = createBrowserRouter([
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
        path:'/',
        element: <App/>
    },
    {
        path:'/User',
        element: <User/>
    }
])
export default router

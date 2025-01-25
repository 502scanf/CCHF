import User from '../page/User/User.jsx'
import { Navigate, createHashRouter, createBrowserRouter} from "react-router-dom";
import App from "../App.jsx";
import Main from "../page/Main/index.jsx";
import Helper from "../page/User/Helper.jsx";
import WorkPlaceManage from "@page/WorkPlaceManage/WorkPlaceManage.jsx";
import Index from "@page/Top";
import Login from "@page/login/Login.jsx";
import FileSpace from "@page/FileSpace/FileSpace.jsx";
import Recycle from "@page/Recycle/Recycle.jsx";

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
                element: <Navigate to="workPlaceManage" replace={true}/>
            },
            {
                path:'workPlaceManage',
                Component: WorkPlaceManage
            },
            {
                path:'fileSpace',
                Component: FileSpace
            },
            {
                path:'recycle',
                Component: Recycle
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

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
import Sign from "@page/sign/sign.jsx";
import AuthRoute from "@page/component/AuthRoute.jsx";

const router = createBrowserRouter([
    {
        path:'/',
        element:<Index/>
    },
    {
        path:'/sign',
        element: <Sign/>
    },
    {
        path:'/login',
        element: <Login/>
    },
    {
        path:'/workPlace/',
        element: <AuthRoute><Main/></AuthRoute>,
        children:[
            //重定向
            {
                path: '/workPlace/',
                element: <Navigate to="workPlaceManage" replace={true}/>
            },
            {
                path:'workPlaceManage',
               element: <WorkPlaceManage/>
            },
            {
                path:'fileSpace',
                element: <FileSpace/>
            },
            {
                path:'recycle',
                element: <Recycle/>
            },


        ]
    },
    {
        path:'/work/:roomId',
        element: <AuthRoute><App/></AuthRoute>
    },
    {
        path:'/User',
        element: <AuthRoute><User/></AuthRoute>
    },
    {
        path:'/Helper',
        element:<AuthRoute><Helper/></AuthRoute>
    },

])
export default router

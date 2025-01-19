import User from '../page/User/User.jsx'
import {createBrowserRouter} from "react-router-dom";

import App from "../App.jsx";


const router = createBrowserRouter([
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

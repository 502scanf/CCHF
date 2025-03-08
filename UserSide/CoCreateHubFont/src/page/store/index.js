import { configureStore } from "@reduxjs/toolkit";
import tabReducer from "./reducers/tab";
import userReducer from "@page/store/reducers/user.js";
import docLstReducer from "./reducers/docList";

export default configureStore({
    reducer: {
        tab:tabReducer,
        docList: docLstReducer,
        user: userReducer
    }
});

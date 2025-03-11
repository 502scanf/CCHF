import { configureStore } from "@reduxjs/toolkit";
import tabReducer from "./reducers/tab";
import userReducer from "@page/store/reducers/user.js";
import docReducer from "./reducers/doc.js";

export default configureStore({
    reducer: {
        tab:tabReducer,
        doc: docReducer,
        user: userReducer
    }
});

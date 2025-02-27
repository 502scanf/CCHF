import { configureStore } from "@reduxjs/toolkit";
import tabReducer from "./reducers/tab";
import docList from "./reducers/docList"
export default configureStore({
    reducer: {
        tab:tabReducer,
        docList: docList
    }
});

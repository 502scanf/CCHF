import { configureStore } from "@reduxjs/toolkit";
import tabReducer from "./reducers/tab.js";
import userReducer from "@page/store/reducers/user.js";
import docReducer from "./reducers/doc.js";
import roomReducer from "@page/store/reducers/room.js";

export default configureStore({
    reducer: {
        tab: tabReducer,
        doc: docReducer,
        user: userReducer,
        room: roomReducer,
    }
});

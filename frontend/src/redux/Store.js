import {configureStore} from "@reduxjs/toolkit"
import userSlice from '../redux/userSlice.js';

import messageSlice from "./messageSlice"
export const store=configureStore({
    reducer:{
        user:userSlice,
        message:messageSlice
    }
})
import { configureStore } from "@reduxjs/toolkit";

import userReducer from './slice/userSlice';
import podcastReducer from './slice/podcastSlice';
import episodeReducer from './slice/episodeSlice';


export default configureStore({
    reducer: {
        user: userReducer,
        podcasts: podcastReducer,
        episode: episodeReducer,
    },
});
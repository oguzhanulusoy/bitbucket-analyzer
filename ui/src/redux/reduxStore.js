import { configureStore } from "@reduxjs/toolkit";
import {PullRequestReducer} from "./pull_request/PullRequestSlice"
import {ProjectsReducer} from "./projects/ProjectsSlice"
import {DialogScreenReducer} from "./dialog/dialogSlice"
import customizationReducer from '../store/customizationReducer';
import { getDefaultMiddleware } from '@reduxjs/toolkit';

const reduxStore = configureStore({
  reducer: {
    data:PullRequestReducer,
    project:ProjectsReducer,
    customization: customizationReducer,
    dialogScreen:DialogScreenReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),

});

export default reduxStore;
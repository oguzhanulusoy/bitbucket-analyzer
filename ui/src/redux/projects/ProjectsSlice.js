import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allProjects:[],
};

const ProjectstSlice = createSlice({
  name: "project", // this name using in action type
  initialState, //this is initial state
  reducers: {
    getProjects: (state, action) => {
      state.allProjects = action.payload;
    },
    
  },
});

export const ProjectsReducer =  ProjectstSlice.reducer;
export const {getProjects } = ProjectstSlice.actions;
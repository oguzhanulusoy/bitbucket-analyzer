import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  openDialog:false,
};
const DialogScreenSlice = createSlice({
  name: "dialog", // this name using in action type
  initialState, //this is initial state
  reducers: {
    openDialogMethod: (state, action) => {
        console.log("gelen payload: ", action)
      state.openDialog = action.payload.open;
      console.log("Son state durumu", state.openDialog)
    },
  },
});

export const DialogScreenReducer =  DialogScreenSlice.reducer;
export const { openDialogMethod } = DialogScreenSlice.actions;
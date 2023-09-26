import { createSlice } from "@reduxjs/toolkit";

export const visibilitySlice = createSlice({
  name: "visibility",
  initialState: {
    value: true,
  },
  reducers: {
    setVisible: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setVisible } = visibilitySlice.actions;

export const selectVisibility = (state) => state.visibility.value;

export default visibilitySlice.reducer;

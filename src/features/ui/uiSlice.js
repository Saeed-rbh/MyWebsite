import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    visibility: false,
    isMenuOpen: false,
    currentPage: "/",
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        updateVisibility: (state, action) => {
            state.visibility = action.payload;
        },
        updateMenu: (state, action) => {
            state.isMenuOpen = action.payload;
        },
        updateCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
    },
});

export const { updateVisibility, updateMenu, updateCurrentPage } = uiSlice.actions;
export default uiSlice.reducer;

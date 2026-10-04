import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    visibility: false,
    isMenuOpen: false,
    menuOrigin: { x: .94, y: .06 },
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
        updateMenuOrigin: (state, action) => {
            state.menuOrigin = action.payload;
        },
        updateCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
    },
});

export const { updateVisibility, updateMenu, updateMenuOrigin, updateCurrentPage } = uiSlice.actions;
export default uiSlice.reducer;

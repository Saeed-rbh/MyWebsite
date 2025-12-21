import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    academicData: [],
    stages: [],
    toggle: [false, undefined, false],
    hover: [false, undefined],
    academicElementSize: [0, 0],
};

const dataSlice = createSlice({
    name: "data",
    initialState,
    reducers: {
        updateData: (state, action) => {
            state.academicData = action.payload;
        },
        updateStages: (state, action) => {
            state.stages = action.payload;
        },
        updateToggle: (state, action) => {
            state.toggle = action.payload;
        },
        updateHover: (state, action) => {
            state.hover = action.payload;
        },
        updateAcademicElementSize: (state, action) => {
            state.academicElementSize = action.payload;
        },
    },
});

export const {
    updateData,
    updateStages,
    updateToggle,
    updateHover,
    updateAcademicElementSize,
} = dataSlice.actions;

export default dataSlice.reducer;

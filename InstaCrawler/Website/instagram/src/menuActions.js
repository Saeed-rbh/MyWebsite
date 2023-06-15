import { createSlice } from '@reduxjs/toolkit';

const menuSlice = createSlice({
  name: 'menu',
  initialState: { isMenuOpen: false },
  reducers: {
    updateMenu: (state, action) => {
      state.isMenuOpen = action.payload;
    },
  },
});

export const { updateMenu } = menuSlice.actions;
export default menuSlice.reducer;
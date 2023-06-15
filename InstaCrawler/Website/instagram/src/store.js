import { configureStore } from '@reduxjs/toolkit';
import menuReducer from './menuActions';

const store = configureStore({
  reducer: {
    menu: menuReducer,
  },
});

export default store;
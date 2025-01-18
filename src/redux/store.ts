import { configureStore } from '@reduxjs/toolkit';
import geoFenceReducer from './reducers';

const store = configureStore({
  reducer: {
    geoFence: geoFenceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

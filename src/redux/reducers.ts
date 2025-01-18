import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Coordinate, GeoFence, GeoFenceState } from '../types';

const initialState: GeoFenceState = {
  savedMaps: [],
};

const geoFenceSlice = createSlice({
  name: 'geoFence',
  initialState,
  reducers: {
    saveGeoFence(state, action: PayloadAction<GeoFence>) {
      state.savedMaps.push(action.payload);
    },
    deleteGeoFence(state, action: PayloadAction<number>) {
      state.savedMaps.splice(action.payload, 1);
    },
    updateGeoFence(
      state,
      action: PayloadAction<{ index: number; coordinates: Coordinate[] }>,
    ) {
      state.savedMaps[action.payload.index].coordinates =
        action.payload.coordinates;
    },
  },
});

export const { saveGeoFence, deleteGeoFence, updateGeoFence } =
  geoFenceSlice.actions;
export default geoFenceSlice.reducer;

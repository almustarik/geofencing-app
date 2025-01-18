export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface GeoFence {
  coordinates: Coordinate[];
}

export interface GeoFenceState {
  savedMaps: GeoFence[];
}

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  MapScreen: undefined;
  ViewMapScreen: { geoFenceIndex: number };
  EditGeoFenceScreen: { geoFenceIndex: number };
};

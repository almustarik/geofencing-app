import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import MapView, { Polygon, Region } from 'react-native-maps';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { RootStackParamList } from '../types';

type ViewMapScreenProps = StackScreenProps<RootStackParamList, 'ViewMapScreen'>;

const ViewMapScreen: React.FC<ViewMapScreenProps> = ({ route }) => {
  const { geoFenceIndex } = route.params;
  const savedMaps = useSelector((state: RootState) => state.geoFence.savedMaps);
  const selectedGeoFence = savedMaps[geoFenceIndex];

  const [region, setRegion] = useState<Region | null>(null);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (selectedGeoFence && selectedGeoFence.coordinates.length > 0) {
      updateMapRegion(selectedGeoFence.coordinates);
    } else {
      Alert.alert('Error', 'No coordinates found for the selected geo-fence.');
    }
  }, [selectedGeoFence]);

  /**
   * Dynamically updates the map region to center the GeoFence area.
   */
  const updateMapRegion = (
    coordinates: { latitude: number; longitude: number }[],
  ) => {
    const latitudes = coordinates.map((point) => point.latitude);
    const longitudes = coordinates.map((point) => point.longitude);

    const minLatitude = Math.min(...latitudes);
    const maxLatitude = Math.max(...latitudes);
    const minLongitude = Math.min(...longitudes);
    const maxLongitude = Math.max(...longitudes);

    const latitudeDelta = maxLatitude - minLatitude + 0.01;
    const longitudeDelta = maxLongitude - minLongitude + 0.01;

    const centerLatitude = (minLatitude + maxLatitude) / 2;
    const centerLongitude = (minLongitude + maxLongitude) / 2;

    const newRegion: Region = {
      latitude: centerLatitude,
      longitude: centerLongitude,
      latitudeDelta,
      longitudeDelta,
    };

    setRegion(newRegion);

    if (mapRef.current) {
      mapRef.current.animateToRegion(newRegion, 1000);
    }
  };

  if (!region) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loaderText}>Loading Map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        region={region}
      >
        {/* Display the geo-fence polygon */}
        {selectedGeoFence.coordinates.length > 0 && (
          <Polygon
            coordinates={selectedGeoFence.coordinates}
            strokeColor="blue"
            fillColor="rgba(0, 0, 255, 0.3)"
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#000',
  },
});

export default ViewMapScreen;

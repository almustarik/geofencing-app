import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, {
  MapPressEvent,
  Marker,
  Polygon,
  Region,
} from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';
import { updateGeoFence } from '../redux/reducers';
import { RootState } from '../redux/store';
import { Coordinate, RootStackParamList } from '../types';

type EditGeoFenceScreenProps = StackScreenProps<
  RootStackParamList,
  'EditGeoFenceScreen'
>;

const EditGeoFenceScreen: React.FC<EditGeoFenceScreenProps> = ({
  navigation,
  route,
}) => {
  const { geoFenceIndex } = route.params;
  const savedMaps = useSelector((state: RootState) => state.geoFence.savedMaps);
  const selectedGeoFence = savedMaps[geoFenceIndex];

  const [region, setRegion] = useState<Region | null>(null);
  const [geoFenceCoordinates, setGeoFenceCoordinates] = useState<Coordinate[]>(
    selectedGeoFence.coordinates,
  );
  const [undoStack, setUndoStack] = useState<Coordinate[][]>([]);
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');
  const [loading, setLoading] = useState<boolean>(true);
  const mapRef = useRef<MapView>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedGeoFence && selectedGeoFence.coordinates.length > 0) {
      updateMapRegion(selectedGeoFence.coordinates);
      setLoading(false);
    } else {
      Alert.alert('Error', 'Invalid geo-fence data.');
      navigation.goBack();
    }
  }, [selectedGeoFence]);

  /**
   * Dynamically updates the map region to center the GeoFence area.
   */
  const updateMapRegion = (coordinates: Coordinate[]) => {
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

    setRegion({
      latitude: centerLatitude,
      longitude: centerLongitude,
      latitudeDelta,
      longitudeDelta,
    });

    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: centerLatitude,
        longitude: centerLongitude,
        latitudeDelta,
        longitudeDelta,
      });
    }
  };

  const centerMap = () => {
    if (region && mapRef.current) {
      mapRef.current.animateToRegion(region, 1000);
    }
  };

  const addGeoFencePoint = (e: MapPressEvent) => {
    const newCoordinates = [...geoFenceCoordinates, e.nativeEvent.coordinate];
    setUndoStack([...undoStack, [...geoFenceCoordinates]]);
    setGeoFenceCoordinates(newCoordinates);
    updateMapRegion(newCoordinates);
  };

  const undoLastPoint = () => {
    if (undoStack.length > 0) {
      const lastState = undoStack.pop()!;
      setGeoFenceCoordinates(lastState);
      setUndoStack([...undoStack]);
      updateMapRegion(lastState);
    } else {
      Alert.alert('Undo', 'No actions to undo.');
    }
  };

  const toggleMapType = () => {
    setMapType(mapType === 'standard' ? 'satellite' : 'standard');
  };

  const saveUpdatedGeoFence = () => {
    if (geoFenceCoordinates.length < 3) {
      Alert.alert(
        'Invalid GeoFence',
        'You need at least 3 points to save a geo-fence.',
      );
      return;
    }
    dispatch(
      updateGeoFence({
        index: geoFenceIndex,
        coordinates: geoFenceCoordinates,
      }),
    );
    navigation.goBack();
  };

  const generateColor = (index: number): string => {
    const colors = [
      '#FF5733', // Red
      '#33FF57', // Green
      '#3357FF', // Blue
      '#FF33A1', // Pink
      '#FF9933', // Orange
      '#9D33FF', // Purple
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loaderText}>Loading GeoFence...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={region!}
        mapType={mapType}
        onPress={addGeoFencePoint}
      >
        {/* Geo-fence Polygon */}
        {geoFenceCoordinates.length > 0 && (
          <Polygon
            coordinates={geoFenceCoordinates}
            strokeColor="blue"
            fillColor="rgba(0, 0, 255, 0.3)"
          />
        )}

        {/* Markers for each point */}
        {geoFenceCoordinates.map((point, index) => (
          <Marker
            key={index}
            coordinate={point}
            pinColor={generateColor(index)}
          />
        ))}
      </MapView>

      {/* Control Buttons */}
      <View style={styles.controls}>
        <Button title="Save Changes" onPress={saveUpdatedGeoFence} />
        <Button
          title="Reset GeoFence"
          onPress={() => setGeoFenceCoordinates([])}
          color="red"
        />
        <Button title="Undo" onPress={undoLastPoint} color="orange" />
        <Button title="Center Location" onPress={centerMap} />
        <Button title={`Map View: ${mapType}`} onPress={toggleMapType} />
      </View>
      <View style={styles.info}>
        <Text
          style={styles.infoText}
        >{`Points: ${geoFenceCoordinates.length}`}</Text>
      </View>
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
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 4,
  },
  info: {
    position: 'absolute',
    top: 20,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 8,
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default EditGeoFenceScreen;

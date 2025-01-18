import { StackScreenProps } from '@react-navigation/stack';
import * as Location from 'expo-location';
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
  Circle,
  MapPressEvent,
  Marker,
  Polygon,
  Region,
} from 'react-native-maps';
import { useDispatch } from 'react-redux';
import { saveGeoFence } from '../redux/reducers';
import { Coordinate, RootStackParamList } from '../types';

type MapScreenProps = StackScreenProps<RootStackParamList, 'MapScreen'>;

const MapScreen: React.FC<MapScreenProps> = ({ navigation, route }) => {
  const [region, setRegion] = useState<Region | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(
    null,
  );
  const [geoFenceCoordinates, setGeoFenceCoordinates] = useState<Coordinate[]>(
    [],
  );
  const [undoStack, setUndoStack] = useState<Coordinate[][]>([]);
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');
  const [loading, setLoading] = useState<boolean>(true);
  const mapRef = useRef<MapView>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission denied',
            'Location access is required to show your current location.',
          );
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const userLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setCurrentLocation(userLocation);
        setRegion({
          ...userLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } catch (error) {
        Alert.alert(
          'Error',
          'Unable to fetch location. Please try again later.',
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const centerMap = () => {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          ...currentLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000,
      );
    }
  };

  const addGeoFencePoint = (e: MapPressEvent) => {
    setUndoStack([...undoStack, [...geoFenceCoordinates]]);
    setGeoFenceCoordinates([...geoFenceCoordinates, e.nativeEvent.coordinate]);
  };

  const undoLastPoint = () => {
    if (undoStack.length > 0) {
      const lastState = undoStack.pop()!;
      setGeoFenceCoordinates(lastState);
      setUndoStack([...undoStack]);
    } else {
      Alert.alert('Undo', 'No actions to undo.');
    }
  };

  const toggleMapType = () => {
    setMapType(mapType === 'standard' ? 'satellite' : 'standard');
  };

  const saveGeoFenceData = () => {
    if (geoFenceCoordinates.length < 3) {
      Alert.alert(
        'Invalid GeoFence',
        'You need at least 3 points to create a GeoFence.',
      );
      return;
    }
    dispatch(saveGeoFence({ coordinates: geoFenceCoordinates }));
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
        <Text style={styles.loaderText}>Fetching your location...</Text>
      </View>
    );
  }

  if (!region) {
    return null;
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={region}
        mapType={mapType}
        onPress={addGeoFencePoint}
      >
        {/* Circle for current location */}
        {currentLocation && (
          <>
            {/* Outer Glow Effect */}
            <Circle
              center={currentLocation}
              radius={50} // Outer glow radius
              strokeColor="rgba(0, 183, 255, 0.5)" // Softer blue for the outer glow
              fillColor="rgba(0, 183, 255, 0.2)" // Semi-transparent fill
            />
            {/* Inner Circle */}
            <Circle
              center={currentLocation}
              radius={20} // Inner circle radius
              strokeColor="rgba(0, 122, 255, 1)" // Vibrant blue
              fillColor="rgba(0, 122, 255, 0.6)" // Solid vibrant blue fill
            />
          </>
        )}

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
            pinColor={generateColor(index)} // Assign a different color to each marker
          />
        ))}
      </MapView>

      {/* Control Buttons */}
      <View style={styles.controls}>
        <Button title="Save GeoFence" onPress={saveGeoFenceData} />
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
        >{`Points Added: ${geoFenceCoordinates.length}`}</Text>
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

export default MapScreen;

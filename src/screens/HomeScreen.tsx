import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { Alert, Button, FlatList, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import GeoFenceListItem from '../components/GeoFenceListItem';
import { deleteGeoFence } from '../redux/reducers';
import { RootState } from '../redux/store';
import { RootStackParamList } from '../types';

type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const savedMaps = useSelector((state: RootState) => state.geoFence.savedMaps);
  const dispatch = useDispatch();

  const handleDelete = (index: number) => {
    Alert.alert(
      'Delete GeoFence',
      'Are you sure you want to delete this geo-fence?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch(deleteGeoFence(index)),
        },
      ],
    );
  };

  const handleView = (index: number) => {
    navigation.navigate('ViewMapScreen', { geoFenceIndex: index });
  };

  const handleEdit = (index: number) => {
    navigation.navigate('EditGeoFenceScreen', { geoFenceIndex: index });
  };

  return (
    <View style={styles.container}>
      <Button
        title="Add New Map"
        onPress={() => navigation.navigate('MapScreen')}
      />
      <FlatList
        data={savedMaps}
        style={styles.flatListContainer}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <GeoFenceListItem
            index={index}
            coordinates={item.coordinates}
            onDelete={() => handleDelete(index)}
            onView={() => handleView(index)}
            onEdit={() => handleEdit(index)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  flatListContainer: {
    marginVertical: 20,
  },
});

export default HomeScreen;

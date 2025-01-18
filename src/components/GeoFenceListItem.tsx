import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Coordinate } from '../types';

interface GeoFenceListItemProps {
  index: number;
  coordinates: Coordinate[];
  onDelete: () => void;
  onView: () => void;
  onEdit: () => void;
}

const GeoFenceListItem: React.FC<GeoFenceListItemProps> = ({
  index,
  coordinates,
  onDelete,
  onView,
  onEdit,
}) => {
  return (
    <View style={styles.listItem}>
      <Text style={styles.text}>
        GeoFence {index + 1}: {coordinates.length} points
      </Text>
      <View style={styles.buttons}>
        <Button title="View" onPress={onView} />
        <Button title="Edit" onPress={onEdit} />
        <Button title="Delete" color="red" onPress={onDelete} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: { fontSize: 16, flex: 1 },
  buttons: { flexDirection: 'row', gap: 8 },
});

export default GeoFenceListItem;

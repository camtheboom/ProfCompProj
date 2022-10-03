import { StyleSheet, View, Text } from 'react-native'
import React, { useState } from 'react';
import MapView, { Marker }from 'react-native-maps';


function Statistics() {
    const [mapRegion, setmapRegion] = useState({
        latitude: -31.953512,
        longitude: 115.857048,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    return (
        <View style={styles.container}>
        <MapView
          style={{ alignSelf: 'stretch', height: '100%' }}
          region={mapRegion}
        >
            <Marker coordinate={mapRegion} title='Marker'/>

        </MapView>
      </View>
    );
};
export default Statistics

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
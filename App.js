import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function Map() {
  const [markers, setMarkers] = useState([]); // Useiden markkereiden tila
  const [location, setLocation] = useState(null); // Käyttäjän sijainnin tila

  useEffect(() => {
    (async () => {
      getUserPosition();
    })();
  }, []);

  const showMarker = (e) => {
    const coords = e.nativeEvent.coordinate;
    setMarkers([...markers, coords]); // Lisää uusi marker taulukkoon
  };

  const getUserPosition = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    try {
      if (status !== 'granted') {
        console.log('Geolocation permission not granted');
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          region={location}
          onLongPress={showMarker} // Aseta markkeri pitkällä painalluksella
        >
          {markers.map((marker, index) => (
            <Marker
              key={index} // Anna markkerille avain
              title={`Marker ${index + 1}`}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
            />
          ))}
        </MapView>
      ) : (
        <Text>Loading map...</Text> // Näytetään, kunnes sijainti on haettu
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

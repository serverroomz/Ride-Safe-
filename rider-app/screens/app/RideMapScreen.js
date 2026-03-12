import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://your-api-url:5000';

export default function RideMapScreen({ route }) {
  const { rideId } = route.params;
  const [userLocation, setUserLocation] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [rideStatus, setRideStatus] = useState('requested');

  useEffect(() => {
    getCurrentLocation();
    setupSocket();
  }, []);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        });
      },
      (error) => console.log(error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const setupSocket = () => {
    const socket = io(SOCKET_URL);
    socket.emit('rideRequested', {
      rideId,
      riderId: 'user-id',
      pickupLocation: { latitude: 0, longitude: 0 },
      dropLocation: { latitude: 0, longitude: 0 },
      estimatedFare: 100
    });

    socket.on('driverLocationBroadcast', (data) => {
      setDriverLocation({
        latitude: data.location.latitude,
        longitude: data.location.longitude
      });
    });

    socket.on('rideInProgress', () => {
      setRideStatus('in_progress');
    });

    socket.on('rideEnded', () => {
      setRideStatus('completed');
    });
  };

  return (
    <View style={styles.container}>
      {userLocation && (
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={userLocation}
          showsUserLocation={true}
        >
          <Marker
            coordinate={userLocation}
            title="You"
            pinColor="blue"
          />
          {driverLocation && (
            <>
              <Marker
                coordinate={driverLocation}
                title="Driver"
                pinColor="red"
              />
              <Polyline
                coordinates={[userLocation, driverLocation]}
                strokeColor="rgba(0,0,0,0.3)"
                strokeWidth={2}
              />
            </>
          )}
        </MapView>
      )}

      <View style={styles.bottomPanel}>
        <Text style={styles.statusText}>Status: {rideStatus.toUpperCase()}</Text>
        {rideStatus === 'requested' && (
          <Text style={styles.info}>Waiting for driver to accept...</Text>
        )}
        {rideStatus === 'in_progress' && (
          <Text style={styles.info}>Driver is on the way</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1
  },
  bottomPanel: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  info: {
    fontSize: 14,
    color: '#666'
  }
});

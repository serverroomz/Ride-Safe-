import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { io } from 'socket.io-client';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

const SOCKET_URL = 'http://your-api-url:5000';

export default function ActiveRideScreen() {
  const [userLocation, setUserLocation] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [rideStatus, setRideStatus] = useState('waiting'); // waiting, in_progress, completed
  const [rideData, setRideData] = useState(null);

  useEffect(() => {
    getCurrentLocation();
    setupSocket();
  }, []);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setDriverLocation({
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

    socket.on('rideAccepted', (data) => {
      setRideData(data);
      setRideStatus('accepted');
      Toast.show({ type: 'success', text1: 'Ride accepted!' });
    });
  };

  const startRide = () => {
    setRideStatus('in_progress');
    Toast.show({ type: 'info', text1: 'Ride started' });
    const socket = io(SOCKET_URL);
    socket.emit('rideStarted', { rideId: rideData?.rideId });
  };

  const completeRide = () => {
    setRideStatus('completed');
    Toast.show({ type: 'success', text1: 'Ride completed' });
    const socket = io(SOCKET_URL);
    socket.emit('rideCompleted', {
      rideId: rideData?.rideId,
      actualFare: 250
    });
  };

  return (
    <View style={styles.container}>
      {driverLocation ? (
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={driverLocation}
          showsUserLocation={true}
        >
          <Marker
            coordinate={driverLocation}
            title="You"
            pinColor="green"
          />
          {userLocation && (
            <>
              <Marker
                coordinate={userLocation}
                title="Passenger"
                pinColor="blue"
              />
              <Polyline
                coordinates={[driverLocation, userLocation]}
                strokeColor="rgba(0,0,0,0.3)"
                strokeWidth={2}
              />
            </>
          )}
        </MapView>
      ) : null}

      <View style={styles.bottomPanel}>
        <Text style={styles.statusText}>Status: {rideStatus.toUpperCase()}</Text>

        {rideStatus === 'accepted' && rideData && (
          <>
            <View style={styles.passengerInfo}>
              <Icon name="person-circle" size={40} color="#e74c3c" />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.passengerName}>{rideData.passengerName}</Text>
                <Text style={styles.passengerPhone}>{rideData.passengerPhone}</Text>
              </View>
            </View>

            <View style={styles.locationInfo}>
              <View style={styles.locationItem}>
                <Icon name="location" size={20} color="#27ae60" />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={styles.label}>Pickup</Text>
                  <Text style={styles.address}>{rideData.pickupLocation?.address}</Text>
                </View>
              </View>

              <View style={styles.locationItem}>
                <Icon name="pin" size={20} color="#e74c3c" />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={styles.label}>Dropoff</Text>
                  <Text style={styles.address}>{rideData.dropLocation?.address}</Text>
                </View>
              </View>
            </View>

            {rideStatus === 'accepted' && (
              <TouchableOpacity style={styles.actionButton} onPress={startRide}>
                <Icon name="play" size={20} color="#fff" style={{ marginRight: 10 }} />
                <Text style={styles.actionButtonText}>Start Ride</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {rideStatus === 'in_progress' && (
          <TouchableOpacity style={styles.completeButton} onPress={completeRide}>
            <Icon name="checkmark" size={20} color="#fff" style={{ marginRight: 10 }} />
            <Text style={styles.actionButtonText}>Complete Ride</Text>
          </TouchableOpacity>
        )}

        {rideStatus === 'waiting' && (
          <Text style={styles.waitingText}>No active ride</Text>
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
    marginBottom: 15
  },
  passengerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  passengerName: {
    fontSize: 16,
    fontWeight: '600'
  },
  passengerPhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 3
  },
  locationInfo: {
    marginBottom: 15
  },
  locationItem: {
    flexDirection: 'row',
    marginBottom: 12
  },
  label: {
    fontSize: 12,
    color: '#999'
  },
  address: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 3
  },
  actionButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  completeButton: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  waitingText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center'
  }
});

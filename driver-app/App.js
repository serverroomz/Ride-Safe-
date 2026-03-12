import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

// Screens
import DriverLoginScreen from './screens/auth/DriverLoginScreen';
import DriverOTPScreen from './screens/auth/DriverOTPScreen';
import DriverProfileScreen from './screens/auth/DriverProfileScreen';
import AvailableRidesScreen from './screens/app/AvailableRidesScreen';
import ActiveRideScreen from './screens/app/ActiveRideScreen';
import EarningsScreen from './screens/app/EarningsScreen';
import DriverAccountScreen from './screens/app/DriverAccountScreen';
import Toast from 'react-native-toast-message';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#fff' }
      }}
    >
      <Stack.Screen name="Login" component={DriverLoginScreen} />
      <Stack.Screen name="OTP" component={DriverOTPScreen} />
      <Stack.Screen name="Profile" component={DriverProfileScreen} />
    </Stack.Navigator>
  );
}

// App Stack (Logged In)
function AppStack() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'AvailableRides') iconName = focused ? 'ticket' : 'ticket-outline';
          else if (route.name === 'ActiveRide') iconName = focused ? 'car' : 'car-outline';
          else if (route.name === 'Earnings') iconName = focused ? 'cash' : 'cash-outline';
          else if (route.name === 'Account') iconName = focused ? 'person' : 'person-outline';
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#ccc',
        tabBarStyle: { height: 60, paddingBottom: 8 }
      })}
    >
      <Tab.Screen name="AvailableRides" component={AvailableRidesScreen} />
      <Tab.Screen name="ActiveRide" component={ActiveRideScreen} />
      <Tab.Screen name="Earnings" component={EarningsScreen} />
      <Tab.Screen name="Account" component={DriverAccountScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      const token = await AsyncStorage.getItem('driverToken');
      setUserToken(token);
    } catch (e) {
      console.log('Error restoring token:', e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null; // Load splash screen
  }

  return (
    <NavigationContainer>
      {userToken ? <AppStack /> : <AuthStack />}
      <Toast />
    </NavigationContainer>
  );
}

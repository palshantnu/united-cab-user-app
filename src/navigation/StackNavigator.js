import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import RiderTrackingScreen from '../screens/mainscreens/RiderTrackingScreen';
import ProfileScreen from '../screens/mainscreens/ProfileScreen';
import BookingDetailsScreen from '../screens/mainscreens/BookingDetailsScreen';
import HistoryScreenWithback from '../screens/mainscreens/HistoryScreenWithback';
import UserInvoiceScreen from '../screens/mainscreens/InvoiceScreen';
import CmsScreen from '../screens/mainscreens/CmsScreen';



const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
      <Stack.Navigator initialRouteName="BottomTabNavigator">
        <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="RiderTrackingScreen" component={RiderTrackingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HistoryScreenWithback" component={HistoryScreenWithback} options={{ headerShown: false }} />
        <Stack.Screen name="UserInvoiceScreen" component={UserInvoiceScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CmsScreen" component={CmsScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
  );
};

export default StackNavigator;

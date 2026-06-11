import React, { useEffect } from 'react';
import {
  Alert,
  Linking,
  LogBox,
  StatusBar,
  StyleSheet,
  Text,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Color } from './src/theme';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import Authnavigation from './src/navigation/Authnavigation';

const MainContent = () => {
  const insets = useSafeAreaInsets();

  // useEffect(() => {
  //   const requestLocationPermission = async () => {
  //     try {
  //       if (Platform.OS === 'android') {
  //         const granted = await PermissionsAndroid.request(
  //           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //           {
  //             title: 'Location Permission',
  //             message: 'We need access to your location to show nearby rides',
  //             buttonNeutral: 'Ask Me Later',
  //             buttonNegative: 'Cancel',
  //             buttonPositive: 'OK',
  //           }
  //         );
  //         if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
  //           Alert.alert('Permission denied', 'Location permission is required.');
  //         }
  //       } else {
  //         const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
  //         if (result !== RESULTS.GRANTED) {
  //           Alert.alert('Permission denied', 'Location permission is required.');
  //         }
  //       }
  //     } catch (err) {
  //       console.warn(err);
  //     }
  //   };

  //   requestLocationPermission();
  // }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: Color.apptheme }}>
      <NavigationContainer>
        <SafeAreaView
          edges={['left', 'right', 'bottom', 'top']}
          style={{
            flex: 1,
            backgroundColor: Color.apptheme,
          }}
        >
          <StatusBar
            animated={true}
            backgroundColor={Color.apptheme}
            barStyle="dark-content"
          />
          <Authnavigation />
        </SafeAreaView>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default MainContent;

const styles = StyleSheet.create({});

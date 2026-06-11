import React, { useEffect, useState } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import configureStore from './src/Redux/Store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainContent from './MainContent';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
let { store, persistor } = configureStore();

const App = () => {
const [showLocationModal, setShowLocationModal] = useState(false);

  const requestLocationPermission = async () => {


    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('whenInUse'); 
      return;
    }


    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'App needs access to your location to provide accurate pickup.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };
  const requestNotificationPermission = async () => {
  

    // ✅ Android 13+
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('❌ Notification permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };
  React.useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!',remoteMessage );
     

    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('onNotificationOpenedApp: ', JSON.stringify(remoteMessage));
      // playSound();
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            JSON.stringify(remoteMessage),
          );
        }
       
      });
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage.notification);
      
    });
  }, []);
  const handleLocationAccept = async () => {
  await AsyncStorage.setItem(
    'location_disclosure_accepted',
    'true',
  );

  setShowLocationModal(false);

  setTimeout(() => {
    requestLocationPermission();
  }, 300);
};
 useEffect(() => {
  checkLocationDisclosure();
  requestNotificationPermission();
}, []);

const checkLocationDisclosure = async () => {
  const accepted = await AsyncStorage.getItem('location_disclosure_accepted');

  if (accepted === 'true') {
    requestLocationPermission();
  } else {
    setShowLocationModal(true);
  }
};

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <MainContent />
          <Modal
  visible={showLocationModal}
  transparent
  animationType="fade"
>
  <View
    style={{
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    }}
  >
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 25,
        width: '100%',
      }}
    >
      <Text
        style={{
          fontSize: 22,
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: 15,
        }}
      >
        Location Access Required
      </Text>

      <Text style={{ fontSize: 15, color: '#444' }}>
        United Cab collects location data to:
      </Text>

      <Text style={{ marginTop: 15 }}>
        • Show nearby drivers
      </Text>

      <Text>
        • Track your ride in real-time
      </Text>

      <Text>
        • Provide accurate pickup and drop-off services
      </Text>

      <Text>
        • Continue updating ride status while a ride is active
      </Text>

      <Text
        style={{
          marginTop: 15,
          color: '#666',
        }}
      >
        Location data may be collected even when the app is in the background during active rides.
      </Text>

      <TouchableOpacity
        onPress={handleLocationAccept}
        style={{
          backgroundColor: '#f2c230',
          padding: 15,
          borderRadius: 10,
          marginTop: 25,
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontWeight: '700',
            color: '#fff',
          }}
        >
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;

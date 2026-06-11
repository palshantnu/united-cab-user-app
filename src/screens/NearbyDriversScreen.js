// import React, { useEffect, useState } from 'react';
// import { View, Text, Button, SafeAreaView } from 'react-native';
// import socket from './Socket';
// import { getNearbyDrivers, updateLocation } from './api';
// import Geolocation from '@react-native-community/geolocation';

// const NearbyDriversScreen = () => {
//     const [drivers, setDrivers] = useState([]);
//     const [userId, setUserId] = useState(1); // suppose your userId is 1
//     const [latitude, setLatitude] = useState(null); // initial lat
//     const [longitude, setLongitude] = useState(null); // initial lng

//     useEffect(() => {
//         socket.connect();

//         // Register user to receive live updates
//         socket.emit('registerUser', userId);

//         // Listen to live updates of nearby drivers
//         socket.on('liveDriverUpdates', (data) => {
//             // console.log('Live Drivers:', data);
//             setDrivers(data);
//         });

//         // Fetch initially nearby drivers
//         fetchNearbyDrivers();
//         handleUpdateLocation();

//         // Watch the user's location
//         const watchId = Geolocation.watchPosition(
//             (position) => {
//                 const { latitude, longitude } = position.coords;
//                 console.log('Updated Position:', latitude, longitude);

//                 // Only update if the location has changed

//                 setLatitude(latitude);
//                 setLongitude(longitude);
//                 socket.emit('updateDriverLocation', { driverId: 2, latitude, longitude });

//             },
//             (error) => console.error('Error watching position:', error),
//             {
//                 enableHighAccuracy: true, // Ensure high accuracy
//                 distanceFilter: 1, // Update location only after the device has moved by 10 meters
//                 interval: 1000, // Update location every second
//                 fastestInterval: 500, // Update as fast as every 500ms if possible
//             }
//         );

//         return () => {
//             // Cleanup socket and geolocation watch on unmount
//             socket.disconnect();
//             Geolocation.clearWatch(watchId);
//         };
//     }, []);


//     const fetchNearbyDrivers = async () => {
//         try {
//             const response = await getNearbyDrivers(latitude, longitude, userId);
//             console.log('Initial Nearby Drivers:', response.data.drivers);
//             setDrivers(response.data.drivers);
//         } catch (error) {
//             console.error('Error fetching drivers', error);
//         }
//     };

//     const handleUpdateLocation = async () => {
//         try {
//             const driver_id = 2; // Your driver id
//             await updateLocation(driver_id, latitude, longitude, true);
//             console.log('Location updated');
//         } catch (error) {
//             console.error('Error updating location', error);
//         }
//     };

//     return (
//         <SafeAreaView>
//             <Text>Nearby Drivers:</Text>
//             {drivers.map((driver) => (
//                 <Text key={driver.id}>
//                     {driver.name} - {driver.location.lat}, {driver.location.lng}
//                 </Text>
//             ))}
//             {/* <Button title="Update My Location" onPress={handleUpdateLocation} /> */}
//         </SafeAreaView>
//     );
// };

// export default NearbyDriversScreen;

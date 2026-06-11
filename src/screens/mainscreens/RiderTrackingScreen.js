// RiderTrackingScreen.js

import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Modal,
    Pressable,
    Platform,
    PermissionsAndroid,
    Image,
    TouchableOpacity,
    Linking
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import MapViewDirections from 'react-native-maps-directions';
import { useSelector } from 'react-redux';
import socket from '../../API/Socket';
import { Color } from '../../theme';
import { CustomToast } from '../../component/ToastConfig';
import { postData } from '../../API';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

const { width, height } = Dimensions.get('window');

const parseCoordinate = (value, fallback = 0) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? fallback : parsed;
};

const RiderTrackingScreen = ({ route, navigation }) => {
    const { rideData, driverDetails } = route.params;
    const [rideStatus, setRideStatus] = useState('');
    const [driverLocation, setDriverLocation] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const mapRef = useRef();
    const user = useSelector(state => state.user);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const pickupLat = parseCoordinate(rideData.pickup_lat);
    const pickupLng = parseCoordinate(rideData.pickup_lng);
    const dropLat = parseCoordinate(rideData.dropoff_lat);
    const dropLng = parseCoordinate(rideData.dropoff_lng);


    const [eta, setEta] = useState(null);
    const [distanceKm, setDistanceKm] = useState(null);

    const GOOGLE_MAPS_API_KEY = 'AIzaSyAvSirrQQWowYpUpem3I7FaeFZTsfWbDLQ';

    // Location permission for Android
    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
    };

    useEffect(() => {
        requestLocationPermission().then((granted) => {
            if (granted) {
                Geolocation.getCurrentPosition(
                    (position) => {
                        setUserLocation({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
                    },
                    (error) => console.warn('Location error', error),
                    { enableHighAccuracy: true }
                );
            }
        });
    }, []);

    useEffect(() => {
        const rideId = rideData.id;
        console.log('rideId==>', rideId);

        const interval = setInterval(async () => {
            try {
                const res = await fetch(
                    `https://unitedcabsmerthyr.uk/api/ride/driver-location/${rideId}`
                );
                const json = await res.json();
                console.log('json', json);

                if (json.success && json.data) {
                    setDriverLocation({
                        latitude: parseFloat(json.data.lat),
                        longitude: parseFloat(json.data.lng),
                    });
                }
            } catch (err) {
                console.log('Location polling error', err);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [rideData.id]);


    useEffect(() => {
        const rideId = rideData.id;

        console.log('rideId', rideId);
        const ride_id = rideId
        socket.emit('getRideStatusFromServer', { rideId });
        socket.emit('joinRide', ride_id);
        socket.on("driverLiveLocation", (data) => {
            console.log('data===>', data);

            if (data.ride_id === rideId) {
                setDriverLocation({
                    latitude: parseFloat(json.data.lat),
                    longitude: parseFloat(json.data.lng),
                });
            }
        });

        const handleRideStatusUpdate = (updateData) => {
            console.log('🟢 User-side ride status update:', updateData);
            setRideStatus(updateData.status);
            if (updateData.status.status === 'completed' || updateData.status.status == 'cancelled') {
                navigation.replace('BottomTabNavigator'); // or navigate to feedback screen
            } else if (updateData.status.status === 'rideend') {
                navigation.replace('UserInvoiceScreen', { id: rideData.id });
            }
            if (updateData.driverLocation) {
                setDriverLocation(updateData.driverLocation);
            }
        };

        const handleDriverLiveLocation = data => {
            console.log('data==>', data);

            if (data.ride_id === rideId) {
                const loc = { latitude: data.lat, longitude: data.lng };
                setDriverLocation(loc);

                // Animate map to follow driver
                mapRef.current?.animateToRegion({
                    ...loc,
                    latitudeDelta: 0.09,
                    longitudeDelta: 0.09,
                }, 1000);
            }
        };

        socket.on('rideStatusUpdate', handleRideStatusUpdate);
        socket.on('driverLiveLocation', handleDriverLiveLocation);

        return () => {
            socket.off('rideStatusUpdate', handleRideStatusUpdate);
            socket.off('driverLiveLocation', handleDriverLiveLocation);
            socket.emit('leaveRideRoom', { ride_id: rideId });
        };
    }, [rideData]);


    const getBadgeColor = () => {
        switch (rideStatus?.status) {
            case 'arrived':
                return { backgroundColor: '#ffeb3b' }; // yellow
            case 'start':
                return { backgroundColor: '#c8e6c9' }; // light green
            case 'completed':
                return { backgroundColor: '#d1c4e9' }; // light purple
            default:
                return { backgroundColor: '#e3f2fd' }; // default blueish
        }
    };

    const ChangeRideStatus = async status => {
        const body = {
            userId: user.id,
            rideId: rideData.id,
        };

        const res = await postData('user/cancel-ride', body);
        console.log('res ==>', res);

        if (res?.success) {
            setModalMessage('Status updated successfully!');
            setModalVisible(true);
            CustomToast.show(res.error);
        } else {
            setModalMessage(res.error || 'Failed to update status');
            setModalVisible(true);
        }
    };

    const getRouteConfig = () => {
        const status = rideStatus?.status || rideData?.status;

        // Before pickup
        if (
            status === 'accepted' ||
            status === 'on_the_way' ||
            !status
        ) {
            return {
                label: 'Pickup',
                destination: {
                    latitude: pickupLat,
                    longitude: pickupLng,
                },
            };
        }

        // After pickup
        if (status === 'arrived' || status === 'started' || status === 'ongoing') {
            return {
                label: 'Drop',
                destination: {
                    latitude: dropLat,
                    longitude: dropLng,
                },
            };
        }

        return null;
    };

    const routeConfig = getRouteConfig();
    const isValidDriverLocation =
        driverLocation &&
        !isNaN(driverLocation.latitude) &&
        !isNaN(driverLocation.longitude);

    return (
        <View style={{ flex: 1 }}>
            <MapView
                ref={mapRef}
                style={{ ...StyleSheet.absoluteFillObject, height: '65%' }}
                initialRegion={{
                    latitude: pickupLat,
                    longitude: pickupLng,
                    latitudeDelta: 0.09,
                    longitudeDelta: 0.09,
                }}

                zoomEnabled
                scrollEnabled
                zoomControlEnabled
            // showsUserLocation={true}
            >
                {console.log('driverLocation==>', driverLocation)
                }
                {/* {userLocation && <Marker coordinate={userLocation} title="You" pinColor="blue" />} */}
                {isValidDriverLocation && (
                    <Marker
                        coordinate={{
                            latitude: Number(driverLocation.latitude),
                            longitude: Number(driverLocation.longitude),
                        }}
                        anchor={{ x: 0.5, y: 0.5 }}
                    >
                        {/* <Image
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/128/684/684908.png' }}
                            style={{
                                width: 40,
                                height: 40,
                                // backgroundColor: 'yellow',
                            }}
                            resizeMode="contain"
                        /> */}
                        {/* <FontAwesome6
                            name="car-side"
                            size={36}
                            color="#1e88e5"
                        /> */}
                        <Text style={{ fontSize: 30 }}>🚘</Text>
                    </Marker>
                )}

                <Marker coordinate={{ latitude: pickupLat, longitude: pickupLng }} title="Pickup" />
                <Marker coordinate={{ latitude: dropLat, longitude: dropLng }} pinColor="green" title="Drop-off" />

                {/* Route - only after ride started */}

                {driverLocation && routeConfig && (
                    <MapViewDirections
                        origin={driverLocation}
                        destination={routeConfig.destination}
                        apikey={GOOGLE_MAPS_API_KEY}
                        strokeWidth={4}
                        strokeColor="#1e88e5"
                        timePrecision="now"
                        onReady={(result) => {
                            console.log('result', result);
                            const distanceInMiles = result.distance * 0.621371;
                            console.log('distanceInMiles', distanceInMiles);

                            setDistanceKm(distanceInMiles);
                            setEta(Math.ceil(result.duration_in_traffic || result.duration));
                        }}
                    />
                )}

            </MapView>
            {console.log('rideStatus', rideStatus, 'rideData', rideData)
            }


            {/* Bottom Card - Info */}
            <View style={styles.bottomCard}>
                {eta && distanceKm && routeConfig && (
                    <View style={styles.etaPill}>
                        <Text style={styles.etaBig}>
                            {routeConfig.label} in {eta} mins
                        </Text>
                        <Text style={styles.etaSmall}>
                            Captain {distanceKm.toFixed(2)} miles away
                        </Text>
                    </View>
                )}
                <View style={{ padding: 20 }}>
                    {/* <Text style={styles.statusText}>
                        {rideStatus?.status?.toUpperCase() || rideData?.status?.toUpperCase() || 'DRIVER ON THE WAY'}
                    </Text> */}

                    <View style={styles.driverRow}>
                        <Image
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/128/149/149071.png' }}
                            style={styles.avatar}
                        />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.driverName}>{driverDetails?.name}</Text>
                            <Text style={styles.vehicle}>
                                {driverDetails?.vehicle_model} • {driverDetails?.vehicle_number}
                            </Text>
                        </View>
                        <View style={styles.rating}>
                            <Ionicons name="star" size={14} color="#ffb300" />
                            <Text style={{ fontWeight: '600' }}>5.0</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <Ionicons name="location-outline" size={20} color="#333" />
                        <Text style={styles.label}>Pickup: {rideData.pickup_address}</Text>
                    </View>

                    <View style={styles.row}>
                        <Ionicons name="flag-outline" size={20} color="#333" />
                        <Text style={styles.label}>Drop-off: {rideData.dropoff_address}</Text>
                    </View>
                    {console.log('rideData', rideData)
                    }
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        {/* <View style={[styles.statusBadge, getBadgeColor()]}>
                        <Text style={styles.statusText}>
                            Ride Status : {rideStatus?.status?.toUpperCase() || rideData?.status.toUpperCase() || 'SEARCHING FOR DRIVER'}
                        </Text>
                    </View> */}
                        <View style={[styles.otpBox, getBadgeColor()]}>
                            <Text style={styles.otpLabel}>Ride Status</Text>
                            <Text style={styles.otpValue}>{rideStatus?.status?.toUpperCase() || rideData?.status.toUpperCase() || 'SEARCHING FOR DRIVER'}</Text>
                        </View>
                        <View style={styles.otpBox}>
                            <Text style={styles.otpLabel}>Your OTP</Text>
                            <Text style={styles.otpValue}>{rideStatus?.otp || rideData?.otp || '----'}</Text>
                        </View>

                    </View>
                    <View style={styles.buttonContainer}>
                        {rideData?.status == 'accepted' && !rideStatus?.status || rideData?.status == 'arrived' || rideStatus?.status == 'arrived' ? <TouchableOpacity
                            style={[styles.cancelButton, { backgroundColor: '#4caf50', marginTop: 15, width: rideData?.status == 'arrived' || rideStatus?.status == 'arrived' ? '90%' : '45%', flex: rideData?.status || rideStatus?.status == 'arrived' == 'arrived' ? 1 : 0 }]}
                            onPress={() => {
                                const phone = rideData?.driver?.phone;
                                const country_code = rideData?.driver?.country_code;
                                if (phone) {
                                    Linking.openURL(`tel:${country_code}+${phone}`);
                                }
                            }}
                        >
                            <Text style={styles.cancelButtonText}>📞 Call</Text>
                        </TouchableOpacity> : null}
                        {rideData?.status == 'accepted' && !rideStatus?.status &&
                            <Pressable
                                onPress={() => {
                                    // cancel logic or confirm modal
                                    ChangeRideStatus(); // simple fallback, you can add cancel API here
                                }}
                                style={styles.cancelButton}
                            >
                                <Text style={styles.cancelButtonText}>Cancel Ride</Text>
                            </Pressable>
                        }
                    </View>
                </View>
            </View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Status Update</Text>
                        <Text style={styles.modalText}>{modalMessage}</Text>
                        <Pressable
                            style={({ pressed }) => [
                                styles.buttonClose,
                                pressed && { opacity: 0.7 },
                            ]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.textStyle}>OK</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

        </View >
    );
};

const styles = StyleSheet.create({
    bottomCard: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        // padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: -3 },
        shadowRadius: 5,
        maxHeight: height * 0.9,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },

    label: {
        fontSize: 16,
        color: '#333',
        marginLeft: 8,
    },

    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#000',
    },

    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 14,
        marginTop: 10,
    },
    statusText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#000',
    },

    cancelButton: {
        marginTop: 15,
        backgroundColor: '#ff5252',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        //  flex: 1,
        width: '45%', marginLeft: '5%'
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // slightly lighter overlay
        paddingHorizontal: 20,
    },
    modalView: {
        width: '100%',
        maxWidth: 320,
        backgroundColor: 'white',
        borderRadius: 16,
        paddingVertical: 30,
        paddingHorizontal: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 12,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Color.apptheme,
        marginBottom: 12,
        textAlign: 'center',
    },
    modalText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 22,
    },
    buttonClose: {
        backgroundColor: Color.apptheme,
        borderRadius: 24,
        paddingVertical: 12,
        paddingHorizontal: 40,
        elevation: 3,
    },
    textStyle: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
        textAlign: 'center',
    },
    otpBox: {
        marginTop: 10,
        paddingVertical: 14,
        paddingHorizontal: 20,
        backgroundColor: '#fce4ec', // soft pink background
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
        marginLeft: 10,
        flex: 1,
    },

    otpLabel: {
        fontSize: 13,
        fontWeight: '500',
        color: '#880e4f',
        marginBottom: 4,
    },

    otpValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#c2185b',
        letterSpacing: 2,
    },
    etaPill: {
        // position: 'absolute',
        // top: 50,
        alignSelf: 'center',
        backgroundColor: '#e8f5e9',
        // paddingHorizontal: 22,
        paddingVertical: 12,
        borderTopRightRadius: 18,
        borderTopLeftRadius: 18,
        // elevation: 6,
        width: '100%'
    },
    etaBig: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2e7d32',
        textAlign: 'center',
    },
    etaSmall: {
        fontSize: 13,
        color: '#555',
        textAlign: 'center',
        marginTop: 2,
    },

    statusText: {
        textAlign: 'center',
        color: '#1e88e5',
        fontWeight: '600',
        marginBottom: 12,
    },
    driverRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
    driverName: { fontSize: 16, fontWeight: '600' },
    vehicle: { fontSize: 13, color: '#666' },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff8e1',
        padding: 6,
        borderRadius: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
});

export default RiderTrackingScreen;

// import React from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     TextInput,
//     FlatList,
//     TouchableOpacity,
//     Dimensions,
//     KeyboardAvoidingView,
//     Platform,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { Color } from '../../theme';

// const { width } = Dimensions.get('window');

// const HomeScreen = () => {
//     const data = ['Your current location', 'Office', 'Home', 'Mall Road', 'Train Station'];

//     return (
//         <View style={styles.container}>
//             <KeyboardAvoidingView
//                 behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//                 style={{ flex: 1 }}
//             >
//                 {/* Header */}
//                 <View style={styles.headerContainer}>
//                     <Text style={styles.header}>Welcome to United Cabs</Text>
//                     <Text style={styles.subHeader}>Safe, smart, and affordable rides</Text>
//                 </View>

//                 {/* Input Card */}
//                 <View style={styles.inputCard}>
//                     {/* Pickup Input */}
//                     <View style={styles.inputRow}>
//                         <Ionicons name="navigate-outline" size={20} color={Color.apptheme} />
//                         <TextInput
//                             placeholder="Pickup Location"
//                             placeholderTextColor="#aaa"
//                             style={styles.textInput}
//                         />
//                     </View>
//                     <View style={styles.divider} />

//                     {/* Drop Input */}
//                     <View style={styles.inputRow}>
//                         <Ionicons name="location-outline" size={20} color={Color.apptheme} />
//                         <TextInput
//                             placeholder="Drop Location"
//                             placeholderTextColor="#aaa"
//                             style={styles.textInput}
//                         />
//                     </View>
//                 </View>

//                 {/* Find Deals Button */}
//                 <TouchableOpacity style={styles.dealButton}>
//                     <Text style={styles.dealButtonText}>🚖 Find Best Ride Deals</Text>
//                 </TouchableOpacity>

//                 {/* Recent Locations */}
//                 <Text style={styles.recentTitle}>Recent Locations</Text>
//                 <FlatList
//                     data={data}
//                     keyExtractor={(item, index) => index.toString()}
//                     renderItem={({ item }) => (
//                         <TouchableOpacity style={styles.recentCard}>
//                             <Ionicons name="time-outline" size={20} color="#555" />
//                             <Text style={styles.recentText}>{item}</Text>
//                         </TouchableOpacity>
//                     )}
//                 />
//             </KeyboardAvoidingView>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fefefe',
//     },
//     headerContainer: {
//         backgroundColor: Color.apptheme,
//         paddingHorizontal: 20,
//         paddingTop: Platform.OS === 'ios' ? 60 : 40,
//         paddingBottom: 40,
//         borderBottomLeftRadius: 20,
//         borderBottomRightRadius: 20,
//     },
//     header: {
//         fontSize: 26,
//         fontWeight: '700',
//         color: '#fff',
//     },
//     subHeader: {
//         fontSize: 14,
//         color: '#eee',
//         marginTop: 6,
//     },
//     inputCard: {
//         marginHorizontal: 20,
//         marginTop: -30,
//         backgroundColor: '#fff',
//         borderRadius: 16,
//         padding: 18,
//         shadowColor: '#000',
//         shadowOpacity: 0.05,
//         shadowOffset: { width: 0, height: 4 },
//         shadowRadius: 8,
//         elevation: 4,
//     },
//     inputRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingVertical: 10,
//     },
//     textInput: {
//         flex: 1,
//         marginLeft: 12,
//         fontSize: 16,
//         color: '#333',
//     },
//     divider: {
//         height: 1,
//         backgroundColor: '#eee',
//         marginVertical: 6,
//     },
//     dealButton: {
//         marginTop: 20,
//         marginHorizontal: 20,
//         backgroundColor: Color.apptheme,
//         paddingVertical: 14,
//         borderRadius: 14,
//         alignItems: 'center',
//         elevation: 4,
//         shadowColor: '#000',
//         shadowOpacity: 0.1,
//         shadowOffset: { width: 0, height: 3 },
//         shadowRadius: 6,
//     },
//     dealButtonText: {
//         color: '#fff',
//         fontSize: 16,
//         fontWeight: '600',
//     },
//     recentTitle: {
//         fontSize: 18,
//         fontWeight: '500',
//         color: '#333',
//         marginHorizontal: 20,
//         marginTop: 28,
//         marginBottom: 10,
//     },
//     recentCard: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: '#fff',
//         marginHorizontal: 20,
//         paddingVertical: 12,
//         paddingHorizontal: 16,
//         borderRadius: 12,
//         marginBottom: 10,
//         shadowColor: '#000',
//         shadowOpacity: 0.03,
//         shadowOffset: { width: 0, height: 2 },
//         shadowRadius: 5,
//         elevation: 2,
//     },
//     recentText: {
//         fontSize: 16,
//         color: '#333',
//         marginLeft: 10,
//     },
// });

// export default HomeScreen;


import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Dimensions,
    Platform,
    Image,
    Animated, Easing,
    ToastAndroid,
    PermissionsAndroid,
    Modal,
    ScrollView,
    Switch,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapView, { Marker, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import { useTranslation } from 'react-i18next';
import { Color } from '../../theme';
import LocationSearchSheet from '../../component/bottomsheet/LocationSearchSheet';
import RideOptionsSheet from '../../component/bottomsheet/RideOptionsSheet';
import { getNearbyDrivers, requestRide, updateLocation } from '../../API/api';
import Geolocation from '@react-native-community/geolocation';
import socket from '../../API/Socket';
import { useSelector } from 'react-redux';
import { postData } from '../../API';
import { CustomToast } from '../../component/ToastConfig';
import ConfirmRideSheet from '../../component/bottomsheet/ConfirmRideSheet';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
const { width, height } = Dimensions.get('window');

// ScheduleModal component with its own styles
const ScheduleModal = ({ visible, onClose, selectedDateTime, onConfirm, formatDateTime }) => {
    const [tempDate, setTempDate] = useState(selectedDateTime);
    const [showPicker, setShowPicker] = useState(false);
    const [error, setError] = useState('');
    const [pickerMode, setPickerMode] = useState('date');
    const [tempSelectedDate, setTempSelectedDate] = useState(selectedDateTime);

    React.useEffect(() => {
        setTempDate(selectedDateTime);
        setTempSelectedDate(selectedDateTime);
    }, [selectedDateTime]);

    const validateDateTime = (date) => {
        const now = new Date();
        const minDateTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now

        if (date < now) {
            return 'Please select a future date and time';
        }

        if (date < minDateTime) {
            return 'Ride must be scheduled at least 1 hour in advance';
        }

        return null;
    };

    const openAndroidPicker = () => {
        const minDate = new Date();
        minDate.setHours(minDate.getHours() + 1);
        
        setPickerMode('date');
        
        DateTimePickerAndroid.open({
            value: tempSelectedDate,
            mode: 'date',
            is24Hour: true,
            minimumDate: minDate,
            onChange: (event, selectedDate) => {
                if (event.type === 'dismissed') return;
                
                if (selectedDate) {
                    setTempSelectedDate(selectedDate);
                    setPickerMode('time');
                    
                    // Keep the selected date and show time picker
                    setTimeout(() => {
                        DateTimePickerAndroid.open({
                            value: selectedDate,
                            mode: 'time',
                            is24Hour: true,
                            onChange: (timeEvent, selectedTime) => {
                                if (timeEvent.type === 'dismissed') {
                                    setPickerMode('date');
                                    return;
                                }
                                
                                if (selectedTime) {
                                    const finalDateTime = new Date(selectedDate);
                                    finalDateTime.setHours(selectedTime.getHours());
                                    finalDateTime.setMinutes(selectedTime.getMinutes());
                                    
                                    const errorMsg = validateDateTime(finalDateTime);
                                    if (errorMsg) {
                                        CustomToast.show(errorMsg);
                                        setPickerMode('date');
                                        return;
                                    }
                                    
                                    onConfirm(finalDateTime);
                                }
                                setPickerMode('date');
                            },
                        });
                    }, 100);
                }
            },
        });
    };

    const onIOSPickerChange = (event, selectedDate) => {
        if (selectedDate) {
            setTempDate(selectedDate);
            const errorMsg = validateDateTime(selectedDate);
            setError(errorMsg || '');
        }
    };

    const confirmIOSDate = () => {
        const errorMsg = validateDateTime(tempDate);
        if (errorMsg) {
            CustomToast.show(errorMsg);
            return;
        }
        onConfirm(tempDate);
        setShowPicker(false);
    };

    const handleConfirm = () => {
        const errorMsg = validateDateTime(selectedDateTime);
        if (errorMsg) {
            CustomToast.show(errorMsg);
            return;
        }
        onConfirm(selectedDateTime);
    };

    const formatDateForDisplay = (date) => {
        const now = new Date();
        const minDateTime = new Date(now.getTime() + 60 * 60 * 1000);

        if (date < minDateTime) {
            const defaultDate = minDateTime;
            return defaultDate.toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        }

        return formatDateTime(date);
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
            statusBarTranslucent={true}
        >
            <View style={scheduleModalStyles.modalOverlay}>
                <View style={scheduleModalStyles.modalContent}>
                    <Text style={scheduleModalStyles.modalTitle}>Schedule Your Ride</Text>

                    <Text style={scheduleModalStyles.infoText}>
                        Please select a date and time at least 1 hour from now
                    </Text>

                    <TouchableOpacity
                        style={scheduleModalStyles.dateTimeButton}
                        onPress={() => {
                            if (Platform.OS === 'android') {
                                openAndroidPicker();
                            } else {
                                setTempDate(selectedDateTime);
                                setShowPicker(true);
                            }
                        }}
                    >
                        <Ionicons name="calendar-outline" size={24} color={Color.apptheme} />
                        <Text style={scheduleModalStyles.dateTimeText}>
                            {formatDateForDisplay(selectedDateTime)}
                        </Text>
                    </TouchableOpacity>

                    {error && (
                        <Text style={scheduleModalStyles.errorText}>{error}</Text>
                    )}

                    {showPicker && Platform.OS === 'ios' && (
                        <View style={scheduleModalStyles.iosPickerContainer}>
                            <View style={scheduleModalStyles.iosPickerHeader}>
                                <TouchableOpacity onPress={() => setShowPicker(false)}>
                                    <Text style={scheduleModalStyles.iosPickerCancel}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={confirmIOSDate}>
                                    <Text style={scheduleModalStyles.iosPickerDone}>Done</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ backgroundColor: '#fff' }}>
                                <DateTimePicker
                                    neutralButton={{ label: 'Clear', textColor: 'black' }}
                                    textColor="black"
                                    value={tempDate}
                                    mode="datetime"
                                    display="spinner"
                                    onChange={onIOSPickerChange}
                                    minimumDate={new Date()}
                                />
                            </View>
                        </View>
                    )}

                    <View style={scheduleModalStyles.modalButtons}>
                        <TouchableOpacity
                            style={[scheduleModalStyles.modalButton, scheduleModalStyles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={scheduleModalStyles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[scheduleModalStyles.modalButton, scheduleModalStyles.confirmButton]}
                            onPress={handleConfirm}
                        >
                            <Text style={scheduleModalStyles.confirmButtonText}>Confirm Schedule</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const scheduleModalStyles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        width: '85%',
        alignItems: 'center',
        maxHeight: '90%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginBottom: 12,
    },
    infoText: {
        fontSize: 13,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    dateTimeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        width: '100%',
        marginBottom: 20,
    },
    dateTimeText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 12,
        flex: 1,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 12,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#f0f0f0',
    },
    confirmButton: {
        backgroundColor: Color.apptheme,
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '500',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    iosPickerContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: Platform.OS === 'ios' ? 20 : 0,
        zIndex: 9999,
        elevation: 10,
    },
    iosPickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    iosPickerCancel: {
        fontSize: 16,
        color: '#666',
    },
    iosPickerDone: {
        fontSize: 16,
        color: Color.apptheme,
        fontWeight: '600',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: -15,
        marginBottom: 15,
        textAlign: 'center',
    },
});

const HomeScreen = ({ navigation }) => {
    const user = useSelector(state => state.user);
    const { t } = useTranslation();
    const sheetRef = useRef(null);
    const [pickup, setPickup] = useState('');
    const [drop, setDrop] = useState('');
    const [activeField, setActiveField] = useState(null);
    const serviceSheetRef = useRef(null);
    const ConfirmsheetRef = useRef(null);
    const mapRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [rideId, setRideID] = useState('');
    const [rideStatus, setRideStatus] = useState('');
    const [showDriverPopup, setShowDriverPopup] = useState(false);
    const [driverInfo, setDriverInfo] = useState(null);
    const [RIDETYPE, setRIDETYPE] = useState('');

    const [isAdvanceBooking, setIsAdvanceBooking] = useState(false);

    // New states for advanced booking
    const [bookingType, setBookingType] = useState('instant');

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDateTime, setSelectedDateTime] = useState(new Date());
    const [showScheduleModal, setShowScheduleModal] = useState(false);

    const [distance, setDistance] = useState('');
    const [fare, setFare] = useState('');

    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                console.log('📍 Location fetched:', latitude, longitude);
                setUserLocation({ latitude, longitude });
                mapRef.current?.animateToRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                });
            },
            error => {
                console.log('❌ Location Error:', error);
                if (error.code === 3) {
                    ToastAndroid.show(
                        'Getting location is taking longer than usual. Please wait…',
                        ToastAndroid.LONG
                    );
                }
            },
            {
                enableHighAccuracy: false,
                timeout: 30000,
                maximumAge: 20000,
            }
        );
    };
    useEffect(() => {
        console.log("Modal Visible:", showScheduleModal);
    }, [showScheduleModal]);

    // active-nearby API: per-minute refresh
    const fetchNearbyDriversIntervalRef = useRef(null);

    const startFetchNearbyDriversTimer = () => {
        // prevent multiple intervals
        if (fetchNearbyDriversIntervalRef.current) return;

        // first call handled by fetchNearbyDrivers() in useEffect
        fetchNearbyDriversIntervalRef.current = setInterval(() => {
            fetchNearbyDrivers();
        }, 60 * 1000);
    };

    const stopFetchNearbyDriversTimer = () => {
        if (fetchNearbyDriversIntervalRef.current) {
            clearInterval(fetchNearbyDriversIntervalRef.current);
            fetchNearbyDriversIntervalRef.current = null;
        }
    };

const sendRideRequest = async (rideType, scheduledDate = selectedDateTime) => {
            const body = {
            userId: user.id,
            pickupLat: pickup.latitude,
            pickupLng: pickup.longitude,
            dropoffLat: drop.latitude,
            dropoffLng: drop.longitude,
            pickup_address: pickup.description,
            dropoff_address: drop.description,
            vehicleTypeId: rideType,
            fare_estimate: fare,
            final_fare: fare,
            distance_km: distance,
            booking_type: bookingType,
        };

        if (bookingType === 'scheduled') {
            body.scheduled_at = scheduledDate.toISOString();
        }
         console.log('scheduled_at==>', selectedDateTime.toISOString());
        console.log('body==>', body);
       
        const res = await postData('rides/request', body);
        console.log('res==>', res);

        if (res.success) {
            if (bookingType === 'scheduled') {
                CustomToast.show('Ride scheduled successfully!');
                setShowScheduleModal(false);
                setPickup('');
                setDrop('');
                setRIDETYPE('');
                setDistance('');
                setFare('');
            } else {
                setRideID(res.rideId);
                setLoading(true);
                setCountdown(60);

                const timer = setInterval(() => {
                    setCountdown((prev) => {
                        if (prev <= 1) {
                            clearInterval(timer);
                            setLoading(false);
                            setShowDriverPopup(false);
                            setDriverInfo(null);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            }
        } else {
            CustomToast.show(res.message);
        }
    };

    const handleConfirm = () => {
        console.log('Booking Type:', selectedDateTime);

        ConfirmsheetRef.current.close();

        setTimeout(() => {
            if (bookingType === 'scheduled') {
                setShowScheduleModal(true);
            } else {
                sendRideRequest(RIDETYPE?.value);
            }
        }, 300);
    };
    const handleScheduleConfirm = (date) => {
        const now = new Date();
        const minDateTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now

        const finalDate = date || selectedDateTime;

        // Validate again before confirming
        if (finalDate < minDateTime) {
            CustomToast.show('Ride must be scheduled at least 1 hour in advance');
            return;
        }

        setSelectedDateTime(finalDate);
        setShowScheduleModal(false);

        const timeDifference = (finalDate - now) / (1000 * 60 * 60);

        if (timeDifference >= 1) {
            setIsAdvanceBooking(true);
            CustomToast.show('Advance booking confirmed for ' + formatDateTime(finalDate));
        } else {
            setIsAdvanceBooking(false);
            CustomToast.show('Ride scheduled for ' + formatDateTime(finalDate));
        }

        sendRideRequest(RIDETYPE?.value, finalDate);
    };

    const handleRideSelect = (rideType) => {
        serviceSheetRef.current?.close();
        setRIDETYPE(rideType);

        setTimeout(() => {
            ConfirmsheetRef.current?.open();
        }, 200);
    };

    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (loading) {
            Animated.loop(
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ).start();
        } else {
            rotateAnim.setValue(0);
        }
    }, [loading]);

    const [drivers, setDrivers] = useState([]);
    const [userId, setUserId] = useState(user.id);
    const [userLocation, setUserLocation] = useState({
        latitude: null,
        longitude: null,
    });

    useEffect(() => {
        socket.connect();
        socket.emit('registerUser', userId);
        // socket.on('liveDriverUpdates', (data) => {
        //     setDrivers(data);
        // });
        fetchNearbyDrivers();
        startFetchNearbyDriversTimer();


        const watchId = Geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ latitude, longitude });
            },
            (error) => console.error('Error watching position:', error),
            {
                enableHighAccuracy: true,
                distanceFilter: 1,
                interval: 1000,
                fastestInterval: 500,
            }
        );

        return () => {
            socket.disconnect();
            Geolocation.clearWatch(watchId);
            stopFetchNearbyDriversTimer();
        };
    }, [userLocation]);

    const fetchNearbyDrivers = async () => {
        try {
            const response = await getNearbyDrivers(userLocation.latitude, userLocation.longitude, userId);
console.log('response Drivers:', response?.data);

            // API: { success, by_vehicle_type:[{vehicle_icon, drivers:[{id,location...}]}] }
            const byVehicleType = response?.data?.by_vehicle_type || [];
console.log('byVehicleType Drivers:', byVehicleType);
            // Flatten to make it easier to render map markers
            const flattened = [];
            byVehicleType.forEach((group) => {
                const vehicleIcon = group?.vehicle_icon;
                const drivers = group?.drivers || [];
                drivers.forEach((d) => {
                    flattened.push({
                        ...d,
                        vehicle_icon: vehicleIcon,
                        vehicle_type: group?.vehicle_type,
                    });
                });
            });
console.log('Flattened Drivers:', flattened);
            setDrivers(flattened);
        } catch (error) {
            console.error('Error fetching drivers', error);
        }
    };

    const userType = 1;
    const [driverDetails, setDriverDetails] = useState('');

    const getDriverDetails = async (driver_id) => {
        const body = { driver_id };
        const res = await postData('driver-profile', body);
        if (res.message == 'Driver profile fetched successfully') {
            setDriverDetails(res.profile);
            setShowDriverPopup(true);
        }
    };

    useEffect(() => {
        if (rideId == '') return;

        socket.emit('joinRideRoom', { rideId, userType, userId });
        socket.emit('getRideStatusFromServer', { rideId });

        const handleRideStatusUpdate = updateData => {
            setRideStatus(updateData.status);
            if (updateData.status.status === 'accepted') {
                setDriverInfo(updateData.status);
                getDriverDetails(updateData.status.driver_id);
            }
        };

        socket.on('rideStatusUpdate', handleRideStatusUpdate);

        return () => {
            // Cleanup if needed
        };
    }, [rideId]);

    const handleFareCalculation = (distance, fare) => {
        setDistance(distance);
        setFare(fare);
    };

    const getDriverDetailsForCheckBooking = async (driver_id, data) => {
        const body = { driver_id: driver_id };
        const res = await postData('driver-profile', body);

        if (res.message == 'Driver profile fetched successfully') {
            navigation.navigate('RiderTrackingScreen', { rideData: data, driverDetails: res.profile });
        }
    };

    const checkReviusRide = async () => {
        const body = { user_id: user.id };
        const res = await postData('user/pending/ride', body);

        if (res.success) {
            if (res.ride.status == "rideend") {
                navigation.navigate('UserInvoiceScreen', { id: res?.ride.id });
            } else {
                await getDriverDetailsForCheckBooking(res.ride.driver_id, res.ride);
            }
        }
    };

    const GOOGLE_API_KEY = 'AIzaSyAvSirrQQWowYpUpem3I7FaeFZTsfWbDLQ';

    const getCurrentPickLocation = async () => {
        Geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const res = await axios.get(
                        'https://maps.googleapis.com/maps/api/geocode/json',
                        {
                            params: {
                                latlng: `${latitude},${longitude}`,
                                key: GOOGLE_API_KEY,
                            },
                        }
                    );
                    const address = res.data.results[0]?.formatted_address || "Current Location";
                    setPickup({
                        description: address,
                        latitude: latitude,
                        longitude: longitude,
                    });
                } catch (err) {
                    console.error('Geocoding API error:', err);
                }
            },
            (error) => {
                console.error('Location permission denied or other error:', error);
            },
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 5000 }
        );
    };

    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission Required',
                        message: 'This app needs location access to work properly',
                        buttonPositive: 'OK',
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true;
    };

    const enableGPS = async () => {
        if (Platform.OS !== 'android') return true;
        try {
            const RNAndroidLocationEnabler = require('react-native-android-location-enabler');
            await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
                interval: 10000,
                fastInterval: 5000,
            });
            return true;
        } catch (err) {
            console.warn('GPS not enabled:', err);
            ToastAndroid.show('Please enable GPS to proceed', ToastAndroid.LONG);
            return false;
        }
    };

    const checkLocationAndGet = async () => {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
            ToastAndroid.show('Location permission denied', ToastAndroid.SHORT);
            return;
        }
        if (Platform.OS === 'android') {
            const gpsEnabled = await enableGPS();
            if (gpsEnabled) {
                getCurrentLocation();
            }
        }
    };

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            checkReviusRide();
            checkLocationAndGet();
            getCurrentLocation();
            getCurrentPickLocation();
        });
        return unsubscribe;
    }, [navigation]);

    const formatDateTime = (date) => {
        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };
if (!userLocation?.latitude || !userLocation?.longitude) {
    return (
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Text>Getting location...</Text>
        </View>
    );
}
    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={StyleSheet.absoluteFillObject}
                provider={Platform.OS === 'ios' ? PROVIDER_DEFAULT : PROVIDER_GOOGLE}
                region={{
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                }}
                showsUserLocation={true}
                showsMyLocationButton={true}
            >
                {userLocation.latitude && (
                    <Marker
                        coordinate={{
                            latitude: userLocation.latitude,
                            longitude: userLocation.longitude,
                        }}
                        image={require('../../assets/8221274.png')}
                    />
                )}

                {drivers?.map((d, idx) => (
                    <Marker
                        key={`${d?.id ?? 'driver'}-${idx}`}
                        coordinate={{
                            latitude: d?.location?.lat,
                            longitude: d?.location?.lng,
                        }}
                        anchor={{ x: 0.5, y: 0.5 }}
                    >
                        {console.log('Rendering driver marker:', d)}
                       <Text style={{ fontSize: 30, color: '#333', textAlign: 'center' }}>🚕</Text>
                       
                    </Marker>
                ))}
            </MapView>

            {!showDriverPopup && !driverInfo && !loading && (
                <View style={styles.topOverlay}>
                    <View style={styles.searchCard}>
                        <TouchableWithoutFeedback onPress={() => {
                            setActiveField('pickup');
                            sheetRef.current?.open();
                        }}>
                            <View style={styles.searchRow}>
                                <Ionicons name="navigate-outline" size={20} color={Color.apptheme} />
                                <TextInput
                                    placeholder={t('pickup_location')}
                                    placeholderTextColor="#888"
                                    style={[styles.textInput, { flex: 1 }]}
                                    value={pickup.description}
                                    editable={false}
                                />
                                {pickup !== '' && (
                                    <TouchableOpacity onPress={() => setPickup('')}>
                                        <Ionicons name="close-circle" size={20} color="#888" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </TouchableWithoutFeedback>

                        <View style={styles.separator} />

                        <TouchableWithoutFeedback onPress={() => {
                            setActiveField('drop');
                            sheetRef.current?.open();
                        }}>
                            <View style={styles.searchRow}>
                                <Ionicons name="location-outline" size={20} color={Color.apptheme} />
                                <TextInput
                                    placeholder={t('drop_location')}
                                    placeholderTextColor="#888"
                                    style={[styles.textInput, { flex: 1 }]}
                                    value={drop.description}
                                    editable={false}
                                />
                                {drop !== '' && (
                                    <TouchableOpacity onPress={() => setDrop('')}>
                                        <Ionicons name="close-circle" size={20} color="#888" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </TouchableWithoutFeedback>

                        <View style={styles.bookingToggleContainer}>
                            <Text style={styles.bookingToggleLabel}>Booking Type:</Text>
                            <View style={styles.toggleButtons}>
                                <TouchableOpacity
                                    style={[
                                        styles.toggleButton,
                                        bookingType === 'instant' && styles.activeToggleButton
                                    ]}
                                    onPress={() => setBookingType('instant')}
                                >
                                    <Text style={[
                                        styles.toggleButtonText,
                                        bookingType === 'instant' && styles.activeToggleButtonText
                                    ]}>
                                        Instant
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.toggleButton,
                                        bookingType === 'scheduled' && styles.activeToggleButton
                                    ]}
                                    onPress={() => {
                                        setBookingType('scheduled');
                                    }}
                                >
                                    <Text style={[
                                        styles.toggleButtonText,
                                        bookingType === 'scheduled' && styles.activeToggleButtonText
                                    ]}>
                                        Schedule
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            )}

            {!showDriverPopup && !driverInfo && !loading && (
                <View style={styles.bottomButtonsContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            if (!pickup) {
                                ToastAndroid.show('Please select pickup location', ToastAndroid.SHORT);
                                setActiveField('pickup');
                                sheetRef.current?.open();
                            } else if (!drop) {
                                ToastAndroid.show('Please select drop location', ToastAndroid.SHORT);
                                setActiveField('drop');
                                sheetRef.current?.open();
                            } else {
                                serviceSheetRef.current?.open();
                            }
                        }}
                        style={styles.rideButton}
                    >
                        <Text style={styles.rideButtonText}>
                            {bookingType === 'scheduled' ? t('Schedule Ride') : t('get_your_ride')}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => getCurrentLocation()}
                        style={styles.locationButton}
                    >
                        <Ionicons name="locate-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            )}

            <LocationSearchSheet
                sheetRef={sheetRef}
                initialValue={activeField === 'pickup' ? pickup : drop}
                activeField={activeField}
                onSelect={(location) => {
                    if (activeField === 'pickup') setPickup(location);
                    if (activeField === 'drop') setDrop(location);
                }}
            />

            <ConfirmRideSheet
                ref={ConfirmsheetRef}
                pickup={pickup}
                drop={drop}
                vehicle={RIDETYPE}
                onFareCalculated={handleFareCalculation}
                onConfirm={handleConfirm}
            />

            <RideOptionsSheet
                sheetRef={serviceSheetRef}
                onSelect={handleRideSelect}
                pickup={pickup}
                drop={drop}
            />

            <ScheduleModal
                visible={showScheduleModal}
                onClose={() => setShowScheduleModal(false)}
                selectedDateTime={selectedDateTime}
                onConfirm={handleScheduleConfirm}
                formatDateTime={formatDateTime}
            />

            {loading && (
                <View style={styles.loaderOverlay}>
                    <View style={styles.loaderCard}>
                        <View style={styles.iconWrapper}>
                            <View style={styles.pulseCircle} />
                            <Ionicons name="car-sport-outline" size={60} color={Color.apptheme} />
                        </View>
                        <Text style={styles.loaderText}>Finding a nearby driver...</Text>
                        <Text style={styles.countdownText}>{countdown} sec remaining</Text>
                        <Animated.View
                            style={[
                                styles.spinner,
                                {
                                    transform: [{
                                        rotate: rotateAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0deg', '360deg'],
                                        }),
                                    }],
                                },
                            ]}
                        />
                    </View>
                </View>
            )}

            {showDriverPopup && driverInfo && (
                <View style={styles.popupOverlay}>
                    <View style={styles.popupCard}>
                        <View style={styles.header}>
                            <Text style={styles.headerText}>Your Driver is Ready!</Text>
                        </View>

                        <Image
                            source={{ uri: driverInfo.image || 'https://cdn-icons-png.flaticon.com/128/149/149071.png' }}
                            style={styles.driverImage}
                        />

                        <Text style={styles.driverName}>{driverDetails.name}</Text>

                        <View style={styles.ratingRow}>
                            {[...Array(5)].map((_, i) => (
                                <Ionicons key={i} name="star" size={18} color="#FFD700" />
                            ))}
                            <Text style={styles.ratingText}>4.9 (120 reviews)</Text>
                        </View>

                        <Text style={styles.vehicleInfo}>
                            {'Toyota Prius'} • {'MH12AB1234'}
                        </Text>

                        <TouchableOpacity
                            style={styles.trackButton}
                            onPress={() => {
                                setShowDriverPopup(false);
                                setDriverInfo(null);
                                navigation.navigate('RiderTrackingScreen', { rideData: rideStatus, driverDetails: driverDetails });
                            }}
                        >
                            <Text style={styles.trackButtonText}>{t('Track Ride')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topOverlay: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 20 : 20,
        width: '100%',
        paddingHorizontal: 0,
    },
    searchCard: {
        width: '95%',
        alignSelf: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 6,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: Platform.OS === 'ios' ? 12 : 8,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    textInput: {
        fontSize: 15,
        marginLeft: 10,
        color: '#333',
        flex: 1,
    },
    separator: {
        height: 8,
    },
    bookingToggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingHorizontal: 16,
    },
    bookingToggleLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    toggleButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    toggleButton: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
    },
    activeToggleButton: {
        backgroundColor: Color.apptheme,
    },
    toggleButtonText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    activeToggleButtonText: {
        color: '#fff',
    },
    bottomButtonsContainer: {
        position: 'absolute',
        bottom: 100,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rideButton: {
        backgroundColor: Color.apptheme,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        zIndex: 10,
        width: '85%',
    },
    rideButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
    },
    locationButton: {
        padding: 10,
        backgroundColor: Color.apptheme,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
    },
    loaderOverlay: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    loaderCard: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
    },
    iconWrapper: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    pulseCircle: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Color.apptheme,
        opacity: 0.2,
        zIndex: -1,
        transform: [{ scale: 1 }],
    },
    loaderText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    countdownText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
    },
    spinner: {
        width: 32,
        height: 32,
        borderWidth: 4,
        borderColor: '#ccc',
        borderTopColor: Color.apptheme,
        borderRadius: 16,
        marginTop: 10,
    },
    popupOverlay: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    popupCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        width: '85%',
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    header: {
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        width: '100%',
        paddingBottom: 12,
    },
    headerText: {
        fontSize: 20,
        fontWeight: '700',
        color: Color.apptheme,
        textAlign: 'center',
    },
    driverImage: {
        width: 110,
        height: 110,
        borderRadius: 55,
        marginBottom: 15,
        borderWidth: 3,
        borderColor: Color.apptheme,
    },
    driverName: {
        fontSize: 22,
        fontWeight: '700',
        color: '#222',
        marginBottom: 8,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    ratingText: {
        fontSize: 14,
        color: '#777',
        marginLeft: 8,
    },
    vehicleInfo: {
        fontSize: 16,
        fontWeight: '600',
        color: '#444',
        marginBottom: 18,
    },
    trackButton: {
        backgroundColor: Color.apptheme,
        paddingVertical: 14,
        paddingHorizontal: 45,
        borderRadius: 30,
        alignItems: 'center',
        width: '100%',
    },
    trackButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
});

export default HomeScreen;
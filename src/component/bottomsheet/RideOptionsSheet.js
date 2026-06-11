// RideOptionsSheet.js
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { getData } from '../../API';
import { useDispatch } from 'react-redux';
import { getRoadDistanceInMiles } from '../utils/getDistance';
import { IMAGE_BASE_URL } from '../../API/api';

const RideOptionsSheet = ({ pickup, drop, sheetRef, onSelect }) => {
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [distance, setDistance] = useState(null);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const getVehicalType = async () => {
        const res = await getData('vehicle-types');

        const formattedData = res.vehicle_types.map(item => ({
            label: item.type_name,
            value: item.id.toString(), // Use string if DropDownPicker expects string
            minimum_km: item.minimum_km,
            minimum_fare: item.minimum_fare,
            fare_per_km: item.fare_per_km,
            vehicle_image: item.vehicle_image,
        }));
        console.log('formattedData', res);
        dispatch({
            type: 'SET_VEHICALTYPE',
            payload: formattedData,
        });

        console.log('formattedData', formattedData);
        setVehicleTypes(formattedData)

    }

    // const distance = getDistanceInMiles(
    //         pickup.latitude,
    //         pickup.longitude,
    //         drop.latitude,
    //         drop.longitude
    //     );

    useEffect(() => {
        const calculateDistance = async () => {
            if (!pickup || !drop) return;

            try {
                const roadDistance = await getRoadDistanceInMiles(
                    pickup.latitude,
                    pickup.longitude,
                    drop.latitude,
                    drop.longitude
                );

                if (roadDistance) {
                    setDistance(roadDistance);
                }
            } catch (e) {
                console.log('RideOptions distance error:', e);
            }
        };

        calculateDistance();
    }, [pickup, drop]);


    useEffect(() => {
        getVehicalType();
    }, [])
    return (
        <RBSheet
            ref={sheetRef}
            height={500}
            openDuration={250}
            customStyles={{
                container: {
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    paddingHorizontal: 16,
                    paddingTop: 20,
                },
            }}
        >
            <ScrollView>
                <Text style={styles.header}>{t('select_vehicle_type')}</Text>
                <Text style={styles.subHeader}>
                    {t('vehicle_type_found', { count: vehicleTypes?.length })}
                </Text>
                {vehicleTypes.map((item) => {
                    const baseKm = item.minimum_km;
                    const baseFare = item.minimum_fare;
                    const perKmFare = item.fare_per_km;


                    // const effectiveDistance = Math.ceil(distance); // round up to nearestmile
                    // // console.log('item',item);
                    // const extraDistance = Math.max(0, distance - baseKm);
                    // const estimatedFare = baseFare + (extraDistance * perKmFare);
                    const effectiveDistance = Math.ceil(distance || 0);
                    const extraDistance = Math.max(0, effectiveDistance - baseKm);
                    const estimatedFare = baseFare + extraDistance * perKmFare;

                    return (
                        <View key={item.name} style={styles.card}>
                            <View style={styles.cardContent}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.carName}>{item.label}</Text>
                                    <Text style={styles.carDetails}>Per miles: £ {item.fare_per_km}</Text>
                                    <Text style={styles.carDetails}>
                                        Distance: {distance ? `${distance} miles` : 'Calculating...'}
                                    </Text>

                                    <Text style={styles.carDetails}>
                                        Est. Fare: £ {distance ? estimatedFare.toFixed(1) : '--'}
                                    </Text>
                                </View>
                                <Image
                                    source={{ uri: `${IMAGE_BASE_URL}/uploads/${item.vehicle_image}` }}
                                    style={styles.carImage}
                                />
                            </View>
                            <TouchableOpacity style={styles.button} onPress={() => onSelect(item)}>
                                <Text style={styles.buttonText}>Select</Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}

            </ScrollView>
        </RBSheet>
    );
};

const styles = StyleSheet.create({
    header: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
        color: '#000',
    },
    subHeader: {
        fontSize: 14,
        color: '#888',
        marginBottom: 16,
    },
    card: {
        backgroundColor: '#fff8e1',
        borderColor: '#fdd835',
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    cardContent: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    carName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    carDetails: {
        fontSize: 14,
        color: '#999',
        marginBottom: 4,
    },
    carDistance: {
        fontSize: 14,
        color: '#666',
    },
    carImage: {
        width: 80,
        height: 50,
        resizeMode: 'contain',
        marginLeft: 12,
        alignSelf: 'center',
    },
    button: {
        backgroundColor: '#fdd835',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        fontWeight: '600',
        color: '#333',
        fontSize: 14,
    },
});

export default RideOptionsSheet;

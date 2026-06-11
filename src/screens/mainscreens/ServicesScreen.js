import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
    SafeAreaView,
} from 'react-native';
import { Color } from '../../theme';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getData } from '../../API';
import { IMAGE_BASE_URL } from '../../API/api';

const services = [
    {
        id: 'bike',
        name: 'Bike',
        icon: 'https://img.icons8.com/color/96/motorcycle.png',
        price: '£25',
        perKm: '£5/km',
        description: 'Fast & cheap for 1 person',
    },
    {
        id: 'auto',
        name: 'Auto',
        icon: 'https://img.icons8.com/color/96/auto-rickshaw.png',
        price: '£35',
        perKm: '£8/km',
        description: 'Affordable 3-wheeler ride',
    },
    {
        id: 'mini',
        name: 'Mini',
        icon: 'https://img.icons8.com/color/96/sedan.png',
        price: '£50',
        perKm: '£10/km',
        description: 'Small car, 3-4 passengers',
    },
    {
        id: 'sedan',
        name: 'Sedan',
        icon: 'https://img.icons8.com/color/96/car--v1.png',
        price: '£70',
        perKm: '£12/km',
        description: 'Comfort ride with space',
    },
    {
        id: 'suv',
        name: 'SUV',
        icon: 'https://img.icons8.com/color/96/suv.png',
        price: '£90',
        perKm: '£15/km',
        description: 'Large car for families',
    },
];


const ServicesScreen = () => {
    const [selectedService, setSelectedService] = useState(null);
    const { t } = useTranslation();

    const [vehicleTypes, setVehicleTypes] = useState([]);

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


    useEffect(() => {
        getVehicalType();
    }, [])
    const renderItem = ({ item }) => {
        const isSelected = selectedService === item.id;
console.log('item==>',item);

        return (
            <View
                style={[styles.card, isSelected && styles.cardSelected]}
                // onPress={() => setSelectedService(item.id)}
            >
                <Image source={{ uri: `${IMAGE_BASE_URL}/uploads/${item.vehicle_image}` }} style={styles.icon} />
                <Text style={styles.name}>{item.label}</Text>
                {/* <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.price}>{item.perKm}</Text> */}
                {/* <Text style={styles.perKm}>{item.perKm}</Text> */}
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
        <View style={styles.container}>
            <Text style={styles.title}>{t('Our Services')}</Text>

            <FlatList
                data={vehicleTypes}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                numColumns={2}
                contentContainerStyle={styles.grid}
                scrollEnabled={false}
            />

            {selectedService && (
                <TouchableOpacity style={styles.bookBtn}>
                    <Text style={styles.bookText}>{t('book')} {selectedService.toUpperCase()}</Text>
                </TouchableOpacity>
            )}
        </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fbff',
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#222',
        textAlign: 'center',
        marginBottom: 20,
    },
    grid: {
        justifyContent: 'space-between',
    },
    card: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 15,
        margin: 8,
        alignItems: 'center',
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        // Elevation for Android
        elevation: 6,
    },

    cardSelected: {
        borderWidth: 2,
        borderColor: '#0c9',
    },
    icon: {
        width: 60,
        height: 60,
        marginBottom: 10,
        resizeMode: 'contain',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        textAlign:'center'
    },
    description: {
        fontSize: 12,
        color: '#777',
        textAlign: 'center',
        marginVertical: 5,
    },
    price: {
        fontSize: 14,
        fontWeight: '600',
        color: Color.apptheme,
    },
    bookBtn: {
        backgroundColor: '#0c9',
        marginTop: 30,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    bookText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    perKm: {
        fontSize: 12,
        color: '#555',
        marginTop: 2,
    },

});

export default ServicesScreen;

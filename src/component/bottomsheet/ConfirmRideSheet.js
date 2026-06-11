// components/ConfirmRideSheet.js
import React, { forwardRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Color } from '../../theme';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // or use react-native-vector-icons
import { getRoadDistanceInMiles } from '../utils/getDistance';

const ConfirmRideSheet = forwardRef(({ pickup, drop, vehicle, onConfirm,onFareCalculated }, ref) => {

const [distance, setDistance] = React.useState(null);
const [fare, setFare] = React.useState(null);

    // const distance = getDistanceInMiles(
    //     pickup.latitude,
    //     pickup.longitude,
    //     drop.latitude,
    //     drop.longitude
    // );
    // const baseKm = vehicle.minimum_km;
    // const baseFare = vehicle.minimum_fare;
    // const perKmFare = vehicle.fare_per_km;

    // const effectiveDistance = Math.ceil(distance); // Round up to nearestmile
    // const extraDistance = Math.max(0, effectiveDistance - baseKm);
    // const fare = baseFare + (extraDistance * perKmFare);

    React.useEffect(() => {
  const calculateFare = async () => {
    if (!pickup || !drop || !vehicle) return;

    try {
      const roadDistance = await getRoadDistanceInMiles(
        pickup.latitude,
        pickup.longitude,
        drop.latitude,
        drop.longitude
      );

      if (!roadDistance) return;

      const baseKm = vehicle.minimum_km;
      const baseFare = vehicle.minimum_fare;
      const perKmFare = vehicle.fare_per_km;

      const effectiveDistance = Math.ceil(roadDistance);
      const extraDistance = Math.max(0, effectiveDistance - baseKm);
      const totalFare = baseFare + extraDistance * perKmFare;

      setDistance(roadDistance);
      setFare(totalFare);

      if (onFareCalculated) {
        onFareCalculated(roadDistance, totalFare);
      }
    } catch (e) {
      console.log('Distance calculation error:', e);
    }
  };

  calculateFare();
}, [pickup, drop, vehicle]);


    React.useEffect(() => {
        if (onFareCalculated && distance && fare) {
            onFareCalculated(distance, fare);
        }
    }, [distance, fare]);
    return (
        <RBSheet
            ref={ref}
            height={400}
            openDuration={250}
            customStyles={{
                container: {
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    paddingHorizontal: 20,
                    paddingTop: 16,
                    backgroundColor: '#fff',
                },
            }}
        >
            <View>
                <Text style={styles.title}>Trip Details</Text>

                <View style={styles.section}>
                    <View style={styles.row}>
                        <FontAwesome name="map-marker" size={18} color={Color.apptheme} />
                        <Text style={styles.label}>Pickup</Text>
                        <Text style={styles.value}>{pickup.description}</Text>
                    </View>

                    <View style={styles.row}>
                        <FontAwesome name="map-pin" size={18} color="#555" />
                        <Text style={styles.label}>Drop</Text>
                        <Text style={styles.value}>{drop.description}</Text>
                    </View>

                    <View style={styles.row}>
                        <FontAwesome name="car" size={18} color="#555" />
                        <Text style={styles.label}>Vehicle</Text>
                        <Text style={styles.value}>{vehicle.label}</Text>
                    </View>
                </View>

                <View style={styles.fareRow}>
  <Text style={styles.fareLabel}>Distance</Text>
  <Text style={styles.fareValue}>
    {distance ? `${distance} mile` : 'Calculating...'}
  </Text>
</View>

<View style={styles.fareRow}>
  <Text style={styles.fareLabel}>Estimated Fare</Text>
  <Text style={styles.fareValue}>
    {fare ? `£${fare.toFixed(2)}` : '—'}
  </Text>
</View>

                <TouchableOpacity style={styles.button} onPress={onConfirm}>
                    <Text style={styles.buttonText}>Confirm & Book</Text>
                </TouchableOpacity>
            </View>
        </RBSheet>
    );
});

export default ConfirmRideSheet;

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 12,
        textAlign: 'center',
        color: '#111',
    },
    section: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#eee',
        paddingVertical: 10,
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
    },
    label: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '500',
        width: 80,
        color: '#444',
    },
    value: {
        fontSize: 14,
        color: '#000',
        flexShrink: 1,
    },
    fareRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 6,
        marginBottom: 16,
        paddingHorizontal: 2,
    },
    fareLabel: {
        fontSize: 16,
        color: '#666',
        fontWeight: '600',
    },
    fareValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111',
    },
    button: {
        backgroundColor: Color.apptheme,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 2,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getData } from '../../API';
import { Color } from '../../theme';
import socket from '../../API/Socket';

const UserInvoiceScreen = ({ route,navigation }) => {
  const { id } = route?.params || {};
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getInvoiceData = async () => {
    setLoading(true);
    try {
      const res = await getData(`getRideDetails/${id || 1}`);
      setData(res?.data);
    } catch (e) {
      Alert.alert('Error', 'Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInvoiceData();
  }, []);
  useEffect(() => {
    const rideId = id;
    
    socket.emit('getRideStatusFromServer', { rideId });

    const handleRideStatusUpdate = (updateData) => {
        console.log('🟢 User-side ride status update--->:', updateData);
        if (updateData.status.status === 'completed' || updateData.status.status == 'cancelled') {
            navigation.replace('BottomTabNavigator'); // or navigate to feedback screen
        }
    };

    socket.on('rideStatusUpdate', handleRideStatusUpdate);

    return () => {
        socket.off('rideStatusUpdate', handleRideStatusUpdate);
    };
}, [id]);
  if (loading || !data) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Color.apptheme} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Your Ride Invoice</Text>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>Ride Completed</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <Icon name="car-outline" size={20} color="#444" />
            <Text style={styles.label}>Driver:</Text>
            <Text style={styles.value}>{data?.driver?.name}</Text>
          </View>

          {/* <View style={styles.row}>
            <Icon name="call-outline" size={20} color="#444" />
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{data?.driver?.phone}</Text>
          </View> */}

          <View style={styles.row}>
            <Icon name="car-sport-outline" size={20} color="#444" />
            <Text style={styles.label}>Vehicle:</Text>
            <Text style={styles.value}>{data?.vehicle?.type_name}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.rowVertical}>
            <Icon name="location-outline" size={20} color="#4caf50" />
            <Text style={styles.label}>Pickup</Text>
            <Text style={styles.value}>{data?.pickup_address}</Text>
          </View>

          <View style={styles.rowVertical}>
            <Icon name="flag-outline" size={20} color="#f44336" />
            <Text style={styles.label}>Drop-off</Text>
            <Text style={styles.value}>{data?.dropoff_address}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Distance:</Text>
            <Text style={styles.value}>{data?.distance_km} mile</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Fare:</Text>
            <Text style={[styles.value, styles.fareValue]}>
              £ {data?.final_fare?.toFixed(2)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>
              {new Date(data?.scheduled_at).toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cashNote}>Payment Mode: Cash</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserInvoiceScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
  },
  statusBadge: {
    alignSelf: 'center',
    backgroundColor: '#4caf50',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rowVertical: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
    color: '#555',
    width: 100,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    flexShrink: 1,
  },
  fareValue: {
    color: '#2c7be5',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cashNote: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
});

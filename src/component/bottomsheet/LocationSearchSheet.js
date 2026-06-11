// LocationSearchSheet.js
import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Button, // Import Button for current location action
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Color } from '../../theme';
import axios from 'axios';
import Geolocation from '@react-native-community/geolocation';

const GOOGLE_API_KEY = 'AIzaSyAvSirrQQWowYpUpem3I7FaeFZTsfWbDLQ'; // Replace with your key

const LocationSearchSheet = ({ sheetRef, onSelect, initialValue, activeField }) => {
  // console.log('initialValue', initialValue);

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(initialValue || '');

  useEffect(() => {
    setQuery(initialValue.description || '');
  }, [initialValue]);

  const fetchLocations = async (text) => {
    if (!text) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
        {
          params: {
            input: text,
            key: GOOGLE_API_KEY,
            // components: 'country:in', // Optional: restrict to India
          },
        }
      );

      setSuggestions(res.data.predictions || []);
    } catch (err) {
      console.error('Google Places API error:', err);
    }
    setLoading(false);
  };

  const handleSelect = async (place) => {
    try {
      const res = await axios.get(
        'https://maps.googleapis.com/maps/api/place/details/json',
        {
          params: {
            place_id: place.place_id,
            key: GOOGLE_API_KEY,
          },
        }
      );

      const details = res.data.result;
      const location = details.geometry.location;

      onSelect({
        description: place.description,
        latitude: location.lat,
        longitude: location.lng,
      });

    } catch (err) {
      console.error('Place details error:', err);
    }

    sheetRef.current?.close();
    setQuery('');
    setSuggestions([]);
  };

  // Function to get current location
  // Function to get current location
  const getCurrentLocation = async () => {
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Reverse Geocoding to get address from latitude and longitude
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
          console.log(address);

          onSelect({
            description: address,
            latitude: latitude,
            longitude: longitude,
          });
          sheetRef.current?.close();
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


  return (
    <RBSheet
      ref={sheetRef}
      height={400}
      openDuration={250}
      customStyles={{
        container: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 16,
        },
      }}
    >
      <View style={styles.searchRow}>
        <Ionicons name="search" size={20} color={Color.apptheme} />
        <TextInput
          placeholder="Search location..."
          placeholderTextColor="#888"
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            fetchLocations(text);
          }}
          style={styles.input}
        />
      </View>

      {activeField === 'pickup' && (  // Check if activeField is 'pickup'
        <TouchableOpacity onPress={() => getCurrentLocation()} style={styles.currentLocationButton}>
          <Ionicons name="location-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Use Current Location</Text>
        </TouchableOpacity>
      )}

      {loading ? (
        <ActivityIndicator size="small" color={Color.apptheme} />
      ) : (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item} onPress={() => handleSelect(item)}>
              <Ionicons name="location-outline" size={20} color="#666" />
              <Text style={styles.itemText}>{item.description}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </RBSheet>
  );
};

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    paddingVertical: 10,
    color: '#333',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    width:'90%'
  },
  itemText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.apptheme, // Use your theme color
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 5, // Shadow effect for Android
    shadowColor: '#000', // Shadow effect for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    textAlign: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default LocationSearchSheet;

import axios from 'axios';

const BASE_URL = 'https://unitedcabsmerthyr.uk/api'; // your actual base url

export const getNearbyDrivers = (latitude, longitude, userId) => {
  return axios.get(`${BASE_URL}/drivers/nearby`, {
    params: {
      latitude,
      longitude,
      userId,
    }
  });
};

export const updateLocation = (driver_id, lat, lng, isDriver = true) => {
  return axios.post(`${BASE_URL}/location/update`, {
    driver_id,
    lat,
    lng,
    isDriver,
  });
};

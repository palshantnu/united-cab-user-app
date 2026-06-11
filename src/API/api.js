import axios from 'axios';

const BASE_URL = 'https://unitedcabsmerthyr.uk/api'; // your actual base url
export const IMAGE_BASE_URL = 'https://unitedcabsmerthyr.uk'; // your actual base url

export const getNearbyDrivers = (latitude, longitude, userId) => {
  console.log('API Call - getNearbyDrivers with:', { latitude, longitude, userId });
  return axios.post(`${BASE_URL}/drivers/active-nearby`, {
      latitude,
      longitude,
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

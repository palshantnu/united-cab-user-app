export const getDistanceInKm = (lat1, lon1, lat2, lon2, rounded = false) => {
  // console.log(lat1, lon1, lat2, lon2);

  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Radius of Earth inmile

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return rounded ? Math.round(distance) : Number(distance.toFixed(3));
};
export const getRoadDistanceInMiles = async (
  originLat,
  originLng,
  destLat,
  destLng,
  apiKey = 'AIzaSyAvSirrQQWowYpUpem3I7FaeFZTsfWbDLQ'
) => {
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originLat},${originLng}&destination=${destLat},${destLng}&mode=driving&key=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();
console.log('data--->',data);

  if (data.routes.length === 0) return null;

  const meters = data.routes[0].legs[0].distance.value;
  return Number((meters * 0.000621371).toFixed(2));
};


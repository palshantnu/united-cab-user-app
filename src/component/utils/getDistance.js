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

const DEFAULT_API_KEY = 'AIzaSyAvSirrQQWowYpUpem3I7FaeFZTsfWbDLQ';
const METERS_TO_MILES = 0.000621371;

// Same pickup/drop -> same result in every sheet (RideOptions, ConfirmRide, request body)
const routeCache = {};

const toWaypoint = (point) =>
  point.place_id
    ? `place_id:${point.place_id}`
    : `${point.latitude},${point.longitude}`;

// Road distance exactly like Google Maps app: driving route, fastest with live traffic.
// Returns { miles, meters, durationMin } — miles rounded to 1 decimal like Google Maps shows.
export const getRideRoute = async (pickup, drop, apiKey = DEFAULT_API_KEY) => {
  if (!pickup?.latitude || !drop?.latitude) return null;

  const origin = toWaypoint(pickup);
  const destination = toWaypoint(drop);
  const key = `${origin}|${destination}`;
  if (routeCache[key]) return routeCache[key];

  const url =
    'https://maps.googleapis.com/maps/api/directions/json' +
    `?origin=${encodeURIComponent(origin)}` +
    `&destination=${encodeURIComponent(destination)}` +
    `&mode=driving&departure_time=now&units=imperial&key=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();
  if (!data.routes?.length) return null;

  const leg = data.routes[0].legs[0];
  const meters = leg.distance.value;
  const route = {
    meters,
    miles: Number((meters * METERS_TO_MILES).toFixed(1)),
    durationMin: Math.round((leg.duration_in_traffic || leg.duration).value / 60),
  };
  routeCache[key] = route;
  return route;
};

export const getRoadDistanceInMiles = async (
  originLat,
  originLng,
  destLat,
  destLng,
  apiKey = DEFAULT_API_KEY
) => {
  const route = await getRideRoute(
    { latitude: originLat, longitude: originLng },
    { latitude: destLat, longitude: destLng },
    apiKey
  );
  return route ? route.miles : null;
};

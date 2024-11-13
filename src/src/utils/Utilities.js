export const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

export const deg2rad = (deg) => deg * (Math.PI / 180);

export const findNearestStation = (userLat, userLon, stations) => {
  let minDistance = Infinity;
  let nearest = null;

  stations.forEach((station) => {
    const distance = getDistanceFromLatLonInKm(
      userLat,
      userLon,
      station.latitude,
      station.longitude
    );
    if (distance < minDistance) {
      minDistance = distance;
      nearest = station;
    }
  });

  return nearest;
};

export const getDayOfWeek = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", { weekday: "long" });
};

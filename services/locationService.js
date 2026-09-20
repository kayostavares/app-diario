import * as Location from 'expo-location';

export const getCurrentLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('PERMISSION_DENIED');
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  const coords = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };

  let address = null;
  try {
    const [geo] = await Location.reverseGeocodeAsync(coords);
    if (geo) {
      const parts = [geo.street, geo.district, geo.city].filter(Boolean);
      address = parts.join(', ');
    }
  } catch (e) {
    console.log('Não foi possível obter endereço nominal', e);
  }

  return {
    ...coords,
    address,
  };
};
const longitude = {
  min: process.env.minLongitude || 10,
  max: process.env.maxLongitude || 30
};
const latitude = {
  min: process.env.minLatitude || 50,
  max: process.env.maxLatitude || 80
};
const altitude = {
  min: process.env.minAltitude || 15,
  max: process.env.maxAltitude || 35
};
const speed = {
  min: process.env.minSpeed || 0,
  max: process.env.maxSpeed || 125
};

module.exports = {
  longitude: longitude,
  latitude: latitude,
  altitude: altitude,
  speed: speed
};

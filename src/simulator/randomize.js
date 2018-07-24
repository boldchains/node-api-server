const params = require('./geoParams');

const randomLongitude = () => {
  let degree = random(params.longitude);
  return format({degree: degree, odd: 'W', even: 'E'});
};

const randomLatitude = () => {
  let degree = random(params.latitude);
  return format({degree: degree, odd:'S', even: 'N'});
};

const randomAltitude = () => {
  return random(params.altitude);
};

const randomSpeed = () => {
  return random(params.speed);
};

const random = param => {
  let rand = (Math.random() * (param.max - param.min)) + param.min;
  return Math.floor(rand);
};

const format = data => {
  let minute = Math.floor(Math.random() * 100);
  let second = (Math.random() * 10).toFixed(2);
  let direction = data.degree % 2 ? data.even : data.odd;
  return data.degree+String.fromCharCode(176)+' '+
          minute+'\' '+
          second+'" '+
          direction;
};

module.exports = {
  latitude: randomLatitude,
  longitude: randomLongitude,
  altitude: randomAltitude,
  speed: randomSpeed
};

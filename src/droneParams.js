//  List any number of drones with Parameters;
//  for now, only three drones with parameters are added

const droneParams = [
  {
    id: 111,
    hostname: '127.0.0.1',
    port: 3111,
    freq: 1000
  },
  {
    id: 222,
    hostname: '127.0.0.1',
    port: 3222,
    freq: 2000
  },
  {
    id: 333,
    hostname: '127.0.0.1',
    port: 3333,
    freq: 20000 // set high to test 'Inactive' status after 10 seconds
  }
];

module.exports.params = droneParams;

# A prototype on __Track Drones__

# Requirements  
ABC company has a number of drones flying around the country.  Build a system to track the location of every drone in real-time. The system's dashboard will only display the last location of the drones, so, no history needs to be maintained in the backend.  For simplicity, store the state of the application in-memory.

Each drone has a unique identifier; it reports its geo-location co-ordinates to the central server in real-time, through a cellular modem connection.  Cellular modem connections are expensive, therefore, make sure the drones report back their location using as little data as possible.

The dashboard is expected to be a simple single page application, displaying the list of active drones, by their unique-identifiers, along with their current speed.  Visually highlight those drones that are not moving for more than 10 seconds.

# Assumptions  
1. Data from Drones are received asynchronously
2. Rate at which data received differs from one drone to another; i.e. drone1 may send data every second, drone2 may send data every two seconds
3. At this time, data is ONLY RECEIVED and NOT SENT to drones for any of the following purposes:
 * controlling its speed
 * changing its geo locations
 * stopping
 * starting
4. For the purpose of this prototype, actual drones are not used, instead, simulated in nodejs server
5. A dashboard looks like:
#### Dashboard: Drones  

| Unique-ID   |Speed in mph  |Latitude            | Longitude            | Altitude   | Status       |
|:-----------:|:------------:|:------------------:| --------------------:| ----------:| ------------:|
| 1234        | 156          | 15&deg;35' 23.9"S  | 156&deg;50'51.948"E  | 75 m       | Active       |
| 4567        | 162          | 26&deg;46'3.81"N   | 55&deg;28'1.23"W     | 12 m       | __Inactive__ |


# Design  

### Server-side

As __NodeJS__ is popular for building asynchronous application, the server side requirment can be implemented in NodeJS.  

To fetch real-time data periodically, client's polling to server is not an ideal one, instead, __socket.io__ library can be used as it is widely used for real-time streaming apps, instant messengers, etc.

### Client-side

For client side coding another popular library __React JS__ can be used, which again supports dynamic data display.


# Skills Required (level) (0-5; 0-No experience, 5-Experienced)  
1. Node JS (5)
2. React JS (5)
3. Socket.IO / Real-time App Development (1)
4. Streaming / ReactiveX / Observables (3)
5. Docker (1)

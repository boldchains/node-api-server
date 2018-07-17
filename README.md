# __Track Drones Real-time__

# Requirements  
ABC company has a number of drones flying around the country.  Build a system to track the location of every drone in real-time. The system's dashboard will only display the last location of the drones, so, no history needs to be maintained in the backend.  For simplicity, store the state of the application in-memory.

Each drone has a unique identifier; it reports its geo-location co-ordinates to the central server in real-time, through a cellular modem connection.  Cellular modem connections are expensive, therefore, make sure the drones report back their location using as little data as possible.

The dashboard is expected to be a simple single page application, displaying the list of active drones, by their unique-identifiers, along with their current speed.  Visually highlight those drones that are not moving for more than 10 seconds.


# Assumptions  
1. Drones' geo locations and speed are received asynchronously
2. Each Drone is sending its data at its own rate; i.e. not all Drones' data are received at the same time
3. A dashboard looks like:
#### Dashboard: Drones  

| Unique-ID   |Speed in mph  |Latitude            | Longitude            | Altitude   | Status       |
|:-----------:|:------------:|:------------------:| --------------------:| ----------:| ------------:|
| 1234        | 156          | 15&deg;35' 23.9"S  | 156&deg;50'51.948"E  | 75 m       | Active       |
| 4567        | 162          | 26&deg;46'3.81"N   | 55&deg;28'1.23"W     | 12 m       | __Inactive__ |

# Design  

Asynchronous data received from drones can be seen as streams of data.  For asynchronous data streams, use of __Reactive Programming__ can provide an elegant solution.  


As __NodeJS__ is popular for building asynchronous application, the dashboard implementation can be done in NodeJS.  

To handle real-time factor, client's polling to server to fetch data periodically is not an ideal one, instead, __websockets__ and __socket.io__ can be used.

For client side coding __React JS__ can be used.

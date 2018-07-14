# Requirements on __Track Drones Real-time__  
A company has a number of drones flying around the country.  Build a system to track the location of every drone in real-time. The system's dashboard will only display the last location of the drones, so, no history needs to be maintained in the backend.  For simplicity, store the state of the application in-memory.

Each drone has a unique identifier; it reports its geo-location co-ordinates to the central server in real-time, through a cellular modem connection.  Cellular modem connections are expensive, therefore, make sure the drones report back their location using as little data as possible.

The dashboard is expected to be a simple single page application, displaying the list of active drones, by their unique-identifiers, along with their current speed.  Visually highlight those drones that are not moving for more than 10 seconds.

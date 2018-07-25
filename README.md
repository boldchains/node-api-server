# A prototype on __Track Drones__ (server-side)

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
| 111         | 156          | 15&deg;35' 23.9"S  | 156&deg;50'51.948"E  | 75 m       | Active       |
| 222         | 6            | 85&deg;35' 53.9"S  | 169&deg;50'21.948"W  | 5 m        | Active       |
| 333         | 62           | 26&deg;46'3.81"N   | 55&deg;28'1.23"W     | 12 m       | __Inactive__ |


# Design  

### Server-side

As __NodeJS__ is popular for building asynchronous application, the server side requirment can be implemented in NodeJS.  

To fetch real-time data periodically, client's polling to server is not an ideal one, instead, __socket.io__ library can be used as it is widely used for real-time streaming apps, instant messengers, etc.

### Client-side

For client side implementation another popular library __React JS__ can be used, which again supports dynamic data display.


# Pre-requisites  

Skills in the following libraries are required:  

1. Node JS
2. React JS
3. Socket.IO
4. Docker (if prototype is run inside such a container)
5. NPM / YARN (optional)

# Installation (server-side)
### Directly on server machine

1. Unzip the drones-server.zip into a folder
2. In a command line, run _npm install_ or _yarn_  
3. npm run build  
4. npm run start  
5. Now, open a browser; enter url as __http://localhost:4001__  it will show a {"response":"Server is alive"}.  This indicates that server is operational.  
6. Proceed with Installation of client-side.  For details, refer README in respective zip file.    

### Docker container  
1. Unzip the drones-server.zip into a folder  
2. In a command line, run __docker-compose up__  
3. After installing required libraries, it will run the server inside the container  
4. Now, open a browser; enter url as __http://localhost:4001__  it will show a {"response":"Server is alive"}.  This indicates that server is operational.  

# Simulated Drones  

For now, three drones are added.  More drones can be added by modifying src/droneParams.js file.  Also, remember to update, client side file src/App.js for its variable droneIds.  

# TODO  
1. Refactor hardcoded data into a separate file or .env file  
2. Write USER MANUAL    
3. Write TECHNICAL MANUAL  

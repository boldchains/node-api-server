# A prototype on __Track Drones__ (server-side)

# Introduction  
Developing a dashboard to show positions of drones flying in an area.  Drone has a unique identifier, it sends its geo-location co-ordinates to the central server in real-time.

Dashboard displays active drones along with their current speed.  Highlights drones that are not moving for more than 10 seconds.

For prototype purpose, Simulated drones are used.

Dashboard looks like:
#### Dashboard: Drones  

| Unique-ID   |Speed in mph  |Latitude            | Longitude            | Altitude   | Status       |
|:-----------:|:------------:|:------------------:| --------------------:| ----------:| ------------:|
| 111         | 156          | 15&deg;35' 23.9"S  | 156&deg;50'51.948"E  | 75 m       | Active       |
| 222         | 6            | 85&deg;35' 53.9"S  | 169&deg;50'21.948"W  | 5 m        | Active       |
| 333         | 62           | 26&deg;46'3.81"N   | 55&deg;28'1.23"W     | 12 m       | __Inactive__ |


### Server-side

The server side is developed in __ExpressJS/NodeJS__.  To get real-time data __socket.io__ library is used


### Client-side

The client side is developed in __React JS__ library.


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

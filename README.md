## Overview
This project uses data from an endpoint in order to track satellite data. Data is gathered by a cron job every 11 seconds since the data is update every 10 seconds. The data is then stored in a MongoDB where it can then be queried to return data to the frontend of the application. The frontend is a dashboard that surfaces a 5 minute status with a warning message if the 5 minute average altitude of the satellite goes below 160km. The 5 minute status also reports the minimum, maximum, and average altitude. Likewise there is a one minute health status that has a message if the 1 minute average altitude goes below 160km. There is also a line graph that will show the average hourly altitude for the past 6 hours.

The client portion of this project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

The server portion was written entirely by me with influence from node projects that I have seen and built in the past.

# Getting Started with Funnel-Satellite
1. clone project by running
```
  git clone git@github.com:DavidAshenfelder/funnel-satellite.git
```
2. add a `config.js` into the `server/src` directory.
```
  module.exports = {
    database: {ENTER_DB_URL_PROVIDED_HERE} || mongodb://localhost:27017/funnel-satellite,
    port: process.env.PORT || 8080,
  }
```
3. cd into `server` and run
```
  npm install
```
4. cd into `server` and run
```
  npm start
```
5. Open a new tab in your terminal
6. cd into `client` and run
```
  npm install
```
7. Finally run
```
  npm start
```

## Available Scripts

In the `server` project directory, you can run:

### `npm test`

Launches the test runner in the interactive watch mode.

### Deployment

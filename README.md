## Overview
This project uses data from an endpoint in order to track satellite data. Data is gathered by a cron job every 11 seconds since the data is update every 10 seconds. The data is then stored in a MongoDB where it can then be queried to return data to the frontend of the application. The frontend is a dashboard that surfaces a 5 minute status with a warning message if the 5 minute average altitude of the satellite goes below 160km. The 5 minute status also reports the minimum, maximum, and average altitude. Likewise there is a one minute health status that has a message if the 1 minute average altitude goes below 160km. There is also a line graph that will show the average hourly altitude for the past 12 hours.

The client portion of this project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

The server portion was written entirely by me with influence from node projects that I have seen and built in the past.

# Getting Started with Funnel-Satellite
1. clone project by running
```
  git clone git@github.com:DavidAshenfelder/funnel-satellite.git
```
2. add the supplied `SUPPLIED_DB_ADDRESS_HERE` into the `server/src/config.js` file.
```
  module.exports = {
    ...
    database: process.env.SATELLITE_MONGO_DB || {SUPPLIED_DB_ADDRESS_HERE},
    ...
  }
```
3. In root directory of project run
```
  npm build
```
  This will build both server and frontend applications.
4. In root directory of project run
```
  npm run start-all
```
  This will run the server on port localhost:3002 and frontend on localhost:3000
  A window in your web browser should pop open to localhost:3000 automatically.

## Available Scripts

In the `server` project directory, you can run:

### `npm test`

Launches the test runner in the interactive watch mode. Here to will see unit tests run to support the data processing after the data is gather from the DB. The endpoints covered will be as follows:
```
  /api/status
  /api/health
  /api/history
```

### Deployment
This project is deployed onto Heroku and integrated with Github.

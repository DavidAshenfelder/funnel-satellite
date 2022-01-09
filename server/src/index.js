// server/index.js
import path from 'path';
import express from 'express';
import timeout from 'connect-timeout';
import mongoose from 'mongoose';
import cron from 'node-cron';
import moment from 'moment';
import axios from 'axios';
import {
  getStatusFromDB,
  getHealthFromDB,
  getHistoryFromDB,
  formatStatusHealthData,
  formatHistoryData
} from './dbUtilities';

const PORT = process.env.PORT || 3002;

const app = express();

import config from './config';

try {
  mongoose.connect(config.database, {useNewUrlParser: true, useUnifiedTopology: true, dbName: 'FunnelLeasing'}, () =>
  console.log("Connected to Database"));
}catch (error) {
  console.log("Could not connect to Database", error);
}

const db = mongoose.connection;

db.on('error', function(err) {
  console.info(`Error: Could not connect to MongoDB. Did you forget to run mongod? Error: ${err}`);
});

const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  // intercept OPTIONS method
  ('OPTIONS' == req.method) ? res.send(200) : next();
};

app.use(allowCrossDomain);
app.use(timeout('300s'));

app.get("/status", (req, res, next) => {
  try {
    const statusObj = getStatusFromDB({ db }).then(resp => {
      res.send(formatStatusHealthData({ data: resp}));
    });
  } catch (err) {
    return next({err});
  }
});

app.get("/history", (req, res, next) => {
  try {
    const statusObj = getHistoryFromDB({ db, hours: 6 }).then(resp => {
      res.send(formatHistoryData({ data: resp}));
    });
  } catch (err) {
    return next({err});
  }
});

app.get("/health", (req, res, next) => {
  try {
    const message = getHealthFromDB({ db }).then(resp => {
      res.send(formatStatusHealthData({ data: resp}));
    });
  } catch (err) {
    return next({err});
  }
});

// Create socket server and tie into app
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

io.on('connection', () => {
  console.log('!!!!!!!socket connected!!!!!!');
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});


// Run cron jobs
cron.schedule('*/11 * * * * *', () => {
  const statusProm = getStatusFromDB({ db });
  const healthProm = getHealthFromDB({ db });
  Promise.all([statusProm, healthProm]).then(([status, health]) => {
    io.emit('satellite-update', {
      status:formatStatusHealthData({ data: status}),
      health:formatStatusHealthData({ data: health }),
    });
  })
});

cron.schedule('*/11 * * * * *', () => {
  axios.get('http://nestio.space/api/satellite/data')
    .then((resp) => {
    const now = moment().toISOString();
    const item = {
      ...resp.data,
      created_at: now,
    };
    const collection = db.collection('satellite');
    collection.insertOne(item, function (err, result) {
    });
  }).catch(error => {
    console.log(error);
  });
});

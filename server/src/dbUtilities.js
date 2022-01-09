import moment from 'moment';

export const formatStatusHealthData = ({ data }) => {
  let minimumAltitude = 0;
  let maximumAltitude = 0;
  let averageAltitude = 0;
  let totalAltitude = 0;
  let message = 'Altitude is A-OK';

  data.map((item, i) => {
    if (item.altitude) {
      if(item.altitude > maximumAltitude) maximumAltitude = item.altitude;
      if(minimumAltitude === 0 || item.altitude < minimumAltitude) minimumAltitude = item.altitude;
      totalAltitude += item.altitude;
      averageAltitude = totalAltitude / (i+1);
    }
  });

  if(averageAltitude < 160) {
    message = 'WARNING: RAPID ORBITAL DECAY IMMINENT'
  }

  return { minimumAltitude, maximumAltitude, averageAltitude, message };
};

export const getStatusFromDB = ({ db, minutes = 5 }) => {
  return new Promise((resolve) => {
    const collection = db.collection('satellite');
    const fiveMinutesAgo = moment().subtract(minutes, 'minutes').toISOString();

    const records = collection.find({'created_at': { $gte: fiveMinutesAgo }}, {sort: [['created_at', -1]]})

    if(records) {
      records.toArray((err, results) => {
        if (err) throw err;
        resolve(results);
      });
    }
  })
};

export const getHealthFromDB = ({ db }) => {
  return new Promise((resolve) => {
    const collection = db.collection('satellite');
    const oneMinuteAgo = moment().subtract(1, 'minute').toISOString();

    const records = collection.find({'created_at': { $gte: oneMinuteAgo }}, {sort: [['created_at', -1]]});

    if(records) {
      records.toArray((err, results) => {
        if (err) throw err;
        resolve(results);
      });
    }
  });
};

export const formatHistoryData = ({ data }) => {
  // **IMPORTANT** note it is important that the data come sorted in desc order for this method to work.
  // I could add a sort here and probably would in production just to make sure
  // but no need for the extra cpu for this demonstration. :)
  const topOfLastHour = moment().startOf('hour').toISOString();

  let averageAltitudeOfHour = 0;
  let totalAltitudeOfHour = 0;
  let topOfLoopHour = moment(topOfLastHour);
  let topOfLoopHourMinus1 = moment(topOfLoopHour).subtract(1, 'hour')
  let itemsInHour = 0
  const historicalData = [];

  data.map((item, i) => {
    // make sure we have altitude and a time to compare
    if (item.altitude && item.created_at) {
      // create a moment for the record timestamp
      const recordMoment = moment(item.created_at);
      // check to see if the time is after the top of the hours
      // because if it is then it would be in the next data set.
      if (recordMoment.isSameOrAfter(topOfLoopHourMinus1)) {
        // if not then add to the data set for the current hour.
        itemsInHour += 1;
        totalAltitudeOfHour += item.altitude;
        averageAltitudeOfHour = totalAltitudeOfHour / itemsInHour;

        if (i+1 === data.length) {
          historicalData.unshift({ altitude: parseFloat(averageAltitudeOfHour).toFixed(2), label: moment(topOfLoopHour).format('LT')});
        }
      } else {

        // if not then push the unshift the current calculations
        historicalData.unshift({ altitude: parseFloat(averageAltitudeOfHour).toFixed(2), label: moment(topOfLoopHour).format('LT')});
        if (i+1 <= data.length) {
          itemsInHour = 0;
          averageAltitudeOfHour = 0;
          totalAltitudeOfHour = 0;
          topOfLoopHour = moment(topOfLoopHour).subtract(1, 'hour');
          topOfLoopHourMinus1 = moment(topOfLoopHour).subtract(1, 'hour');

          // don't forget to include the current item in the new data calculations.
          itemsInHour += 1;
          totalAltitudeOfHour += item.altitude;
          averageAltitudeOfHour = totalAltitudeOfHour / itemsInHour;
        }
      }
    }
  });

  return historicalData;
};

export const getHistoryFromDB = ({ db, hours = 6 }) => {
  return new Promise((resolve) => {
    const collection = db.collection('satellite');
    const topOfLastHour = moment().startOf('hour').toISOString();
    const historicalHoursAgo = moment(topOfLastHour).subtract(hours, 'hours').toISOString();

    const records = collection.find({'created_at': { $gte: historicalHoursAgo }}, {sort: [['created_at', -1]]});
    const data = [];

    if(records) {
      records.toArray((err, results) => {
        if (err) throw err;
        resolve(results);
      });
    } else {
      resolve(data);
    }
  })
};

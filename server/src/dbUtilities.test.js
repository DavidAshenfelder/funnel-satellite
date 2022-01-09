import { formatStatusHealthData, formatHistoryData } from './dbUtilities';
import moment from 'moment';

test('Test average altitude >= 160 gets A-Ok', () => {
  const testData = [
    {
      "altitude":170,
      "last_updated":"2022-01-08T02:19:30",
      "created_at":"2022-01-08T02:22:44.655Z"
    },
    {
      "altitude":160,
      "last_updated":"2022-01-08T02:19:30",
      "created_at":"2022-01-08T02:22:44.655Z"
    },
    {
      "altitude":150,
      "last_updated":"2022-01-08T02:19:30",
      "created_at":"2022-01-08T02:22:44.655Z"
    },
  ]
  expect(formatStatusHealthData({ data: testData })).toEqual(
    {
      minimumAltitude: 150,
      maximumAltitude: 170,
      averageAltitude: 160,
      message: "Altitude is A-OK"
    }
  );
});

test('Test average altitude < 160 gets Orbital Decay', () => {
  const testData = [
    {
      "altitude":145,
      "last_updated":"2022-01-08T02:19:30",
      "created_at":"2022-01-08T02:22:44.655Z"
    },
    {
      "altitude":150,
      "last_updated":"2022-01-08T02:19:30",
      "created_at":"2022-01-08T02:22:44.655Z"
    },
    {
      "altitude":140,
      "last_updated":"2022-01-08T02:19:30",
      "created_at":"2022-01-08T02:22:44.655Z"
    },
  ]
  expect(formatStatusHealthData({ data: testData })).toEqual(
    {
      minimumAltitude: 140,
      maximumAltitude: 150,
      averageAltitude: 145,
      message: "WARNING: RAPID ORBITAL DECAY IMMINENT"
    }
  );
});

test('Test historical data method', () => {
  // time dependant tests can get a bit tricky and depending on if this ran
  // right before the top of the hour this could get a bit fickle bot for all intents
  // and purposes this should work for now.
  const startOfHour = moment().startOf('hour').toISOString();
  const testData = [
    {
      "altitude": 135,
      "created_at": moment(startOfHour).subtract(1, 'hour').add(1, 'minute').toISOString(),
    },
    {
      "altitude": 150,
      "created_at": moment(startOfHour).subtract(1, 'hour').add(1, 'minute').toISOString(),
    },
    {
      "altitude": 145,
      "created_at": moment(startOfHour).subtract(2, 'hour').add(1, 'minute').toISOString(),
    },
    {
      "altitude": 160,
      "created_at": moment(startOfHour).subtract(2, 'hour').add(1, 'minute').toISOString(),
    },
    {
      "altitude": 155,
      "created_at": moment(startOfHour).subtract(3, 'hour').add(1, 'minute').toISOString(),
    },
    {
      "altitude": 170,
      "created_at": moment(startOfHour).subtract(3, 'hour').add(1, 'minute').toISOString(),
    },
  ]

  const fomattedData = formatHistoryData({ data: testData });

  expect(fomattedData[0].altitude).toEqual('162.50');
  expect(fomattedData[0].label).toEqual(moment(startOfHour).subtract(3, 'hours').format('LT'));
  expect(fomattedData[1].altitude).toEqual('152.50');
  expect(fomattedData[1].label).toEqual(moment(startOfHour).subtract(2, 'hours').format('LT'));
  expect(fomattedData[2].altitude).toEqual('142.50');
  expect(fomattedData[2].label).toEqual(moment(startOfHour).subtract(1, 'hours').format('LT'));
});

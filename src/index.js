const React = require('react');
const ReactDOM = require('react-dom');
const {
  CartesianGrid,
  LineChart,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} = require('recharts');

const weightTransitions = require('./weight-transitions.json');

const dateToDateString = (date) => {
  const year = date.getUTCFullYear().toString().padStart(4, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = date.getUTCDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * @return {Array<Object>} Date list from the first day of measurement to the last day.
 *                         e.g. [{dateTime: <timestamp>[, weight: <float>]}, ...]
 *                         Weight is set only on the day of measurement.
 */
const mapWeightTransitionsToGraphData = (weightTransitions) => {
  const dateStringToDate = (dateString) => {
    const year = dateString.replace(/^(\d+)-\d+-\d+$/, '$1');
    const month =dateString.replace(/^\d+-(\d+)-\d+$/, '$1');
    const day = dateString.replace(/^\d+-\d+-(\d+)$/, '$1');
    const utcDateString = `${dateString} 00:00:00+0000`;
    const date = new Date(utcDateString);
    if (
      date.toString() === 'Invalid Date' ||
      date.getUTCFullYear() < 2018 ||
      date.getUTCFullYear() >= 3000
    ) {
      throw new Error('Contains an incorrectly formatted date.');
    }
    return date;
  };
  const findWeightTransitionByDate = (weightTransitions, date) => {
    return weightTransitions.find(e => e.date === date);
  };

  const startDate = dateStringToDate(weightTransitions[0].date);
  const endDate = dateStringToDate(weightTransitions[weightTransitions.length - 1].date);
  let currentTime = startDate.getTime();
  const plotOfDates = [];
  while (true) {
    const currentDate = new Date(currentTime);
    const currentDateString = dateToDateString(currentDate);
    const plotOfDate = {
      dateTime: currentTime,
    };
    const found = findWeightTransitionByDate(weightTransitions, currentDateString);
    if (found) {
      plotOfDate.weight = found.weight;
    }
    plotOfDates.push(plotOfDate);
    if (currentTime >= endDate.getTime()) {
      if (currentTime !== endDate.getTime()) {
        throw new Error('It should equal.');
      }
      break;
    }
    currentTime += 24 * 60 * 60 * 1000;
  }

  if (plotOfDates[0].weight === undefined || plotOfDates[plotOfDates.length - 1].weight === undefined) {
    throw new Error('They should have their weight.');
  }

  return plotOfDates;
};

const WeightTransitionsGraph = () => {
  const data = mapWeightTransitionsToGraphData(weightTransitions.weightTransitions)
    .filter(e => e.weight !== undefined);

  return (
    <LineChart width={800} height={400} data={data}>
      <Line type="monotone" dataKey="weight" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <XAxis
        dataKey="dateTime"
        domain={['dataMin', 'dataMax']}
        padding={{left: 20, right: 20}}
        tickFormatter={dateTime => dateToDateString(new Date(dateTime)).replace(/^(\d+)-(\d+)-(\d+)$/, '$1/$2/$3')}
        type="number"
      />
      <YAxis
        unit="kg"
      />
      <Tooltip
        formatter={(value, name, props) => {
          return value.toFixed(2) + 'kg';
        }}
        labelFormatter={(value, name, props) => {
          return dateToDateString(new Date(value)).replace(/^(\d+)-(\d+)-(\d+)$/, '$1/$2/$3');
        }}
      />
    </LineChart>
  );
};

const Root = () => {
  return <WeightTransitionsGraph />;
};

window.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    React.createElement(Root, {}),
    document.querySelector('.js-app')
  );
});

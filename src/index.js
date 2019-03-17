const React = require('react');
const ReactDOM = require('react-dom');
const {
  CartesianGrid,
  LineChart,
  Line,
  XAxis,
  YAxis,
} = require('recharts');

const weightTransitions = require('../weight-transitions.json');

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
      date.toString() === 'Invalid date' ||
      date.getUTCFullYear() < 2018 ||
      date.getUTCFullYear() >= 3000
    ) {
      throw new Error('Contains an incorrectly formatted date.');
    }
    return date;
  };
  const dateToDateString = (date) => {
    const year = date.getUTCFullYear().toString().padStart(4, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const findWeightTransitionByDate = (weightTransitions, date) => {
    return weightTransitions.find(e => e.date === date);
  };

  const startDate = dateStringToDate(weightTransitions[0].date);
  const endDate = dateStringToDate(weightTransitions[weightTransitions.length - 1].date);
  let currentTime = startDate.getTime();
  const ticks = [];
  while (true) {
    const currentDate = new Date(currentTime);
    const currentDateString = dateToDateString(currentDate);
    const tick = {
      dateTime: currentTime,
    };
    const found = findWeightTransitionByDate(weightTransitions, currentDateString);
    if (found) {
      tick.weight = found.weight;
    }
    ticks.push(tick);
    if (currentTime >= endDate.getTime()) {
      if (currentTime !== endDate.getTime()) {
        throw new Error('It should equal.');
      }
      break;
    }
    currentTime += 24 * 60 * 60 * 1000;
  }

  if (ticks[0].weight === undefined || ticks[ticks.length - 1].weight === undefined) {
    throw new Error('They should have their weight.');
  }

  return ticks;
};

const WeightTransitionsGraph = () => {
  const data = weightTransitions.weightTransitions.map(weightTransition => {
    return {
      weight: weightTransition.weight,
      date: weightTransition.date,
    };
  });

  return (
    <LineChart width={800} height={400} data={data}>
      <Line type="monotone" dataKey="weight" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <XAxis
        dataKey="date"
        interval="preserveStartEnd"
        padding={{left: 10, right: 10}}
        tickFormatter={(dateString) => dateString.replace(/^\d+-(\d+)-(\d+)$/, '$1/$2')}
      />
      <YAxis/>
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

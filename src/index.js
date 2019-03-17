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

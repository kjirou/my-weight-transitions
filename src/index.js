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
    <LineChart width={600} height={300} data={data}>
      <Line type="monotone" dataKey="weight" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <XAxis dataKey="date"/>
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

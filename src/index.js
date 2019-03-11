const React = require('react');
const ReactDOM = require('react-dom');

const Root = () => {
  return <div>Hello, React!</div>
};

window.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<Root />, document.querySelector('.js-app'));
});

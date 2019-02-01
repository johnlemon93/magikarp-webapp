import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import Loadable from 'react-loadable';

Loadable.preloadReady().then(() => {
  ReactDOM.render(<App />, document.getElementById('root'))
});

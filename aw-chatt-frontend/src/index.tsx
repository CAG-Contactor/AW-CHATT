import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
      <audio id="music1" preload="auto" crossOrigin="anonymous">
          <source src="https://sverigesradio.se/topsy/direkt/132-hi-mp3" type="audio/mpeg"/>
      </audio>

      <audio id="music2" preload="auto" crossOrigin="anonymous">
          <source src="https://sverigesradio.se/topsy/direkt/2562-hi-mp3" type="audio/mpeg"/>
      </audio>

    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

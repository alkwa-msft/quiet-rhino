import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  useEffect(() => {
    (async() => {
      const response = await (await fetch('api/Ping')).json()
      console.log(response)
    })();
  })

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <HomeScreen />
        </Route>
        <Route path="/chat">
          <ChatScreen />
        </Route>
        <Route path="/feedback">
          <FeedbackScreen />
        </Route>
      </Switch>
    </Router>
  );
}

const HomeScreen = (): JSX.Element => {
  return <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
}

const ChatScreen = ():JSX.Element => {
  return <div>Chat Screen</div>
}

const FeedbackScreen = ():JSX.Element => {
  return <div>Did you have a good experience?</div>
}

export default App;

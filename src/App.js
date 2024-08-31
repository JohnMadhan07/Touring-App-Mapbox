import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import Places from './places/pages/Places';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import './shared/components/Navigation/MainNavigation.css';

const App = () => {
  return (
    <Router>
      <MainNavigation />
      <main>
        <Switch>
          <Route path="/" exact>
            <Places />
          </Route>
        </Switch>
      </main>
    </Router>
  );
};

export default App;

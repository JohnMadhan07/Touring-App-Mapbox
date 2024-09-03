import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import Directions from './Maps/Directions'; 
import Places from './places/pages/Places';
import Place from './places/pages/Place';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import './shared/components/Navigation/MainNavigation.css';
import Search from './Maps/Search';

const App = () => {
  return (
    <Router>
      <MainNavigation />
      <main>
        <Switch>
          <Route path="/" exact>
            <Places />
          </Route>
          <Route path="/:placeId/place" exact>
            <Place />
          </Route>
          <Route path="/directions" exact>
            <Directions /> 
          </Route>
          <Route path="/search" exact>
            <Search /> 
          </Route>
        </Switch>
      </main>
    </Router>
  );
};

export default App;

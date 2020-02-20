import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import React from 'react';

import AuthPage from './pages/Auth';
import './App.css';
import EventsPage from './pages/Events';
import BookingsPage from './pages/Bookings';
import MainNavigation from './components/Navigation/MainNavigation';

function App() {
  return (
    <BrowserRouter>
      <MainNavigation />
      <main className="main-content">
        <Switch>
          <Redirect from="/" to="/auth" component={null} exact />
          <Route path="/auth" component={AuthPage} />
          <Route path="/events" component={EventsPage} />
          <Route path="/bookings" component={BookingsPage} />
        </Switch>
      </main>
    </BrowserRouter>
  );
}

export default App;

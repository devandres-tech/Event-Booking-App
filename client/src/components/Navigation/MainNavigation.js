import React from 'react'
import { NavLink } from 'react-router-dom';

import './MainNavigation.css';

export default function MainNavigation() {
  return (
    <header className="main-navigation">
      <div className="main-navigation__logo">
        <h1>EasyEvent</h1>
      </div>
      <div className="main-navigation__items">
        <ul>
          <li><NavLink to="/auth">auth</NavLink></li>
          <li><NavLink to="/events">events</NavLink></li>
          <li><NavLink to="/bookings">bookings</NavLink></li>
        </ul>
      </div>
    </header>
  )
}

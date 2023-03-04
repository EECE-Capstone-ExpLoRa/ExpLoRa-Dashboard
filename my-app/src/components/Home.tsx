import React from "react";
// importing Link from react-router-dom to navigate to 
// different end points.
import {
  Link,
  Outlet
} from "react-router-dom";
  
export const Home = () => {
  return (
    <div >
      <nav>
        <ul>
        <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/signin">Sign In</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
      </ul>
      </nav>
      <Outlet />
    </div>
  );
};
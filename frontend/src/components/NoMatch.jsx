import React from "react";
import { Link } from "react-router-dom";


export default function NoMatch() {
  return (
    <div>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}
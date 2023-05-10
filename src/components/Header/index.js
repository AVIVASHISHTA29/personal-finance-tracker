import React from "react";
import "./styles.css";
import { Link } from "react-router-dom";
function Header() {
  return (
    <div className="navbar">
      <p className="navbar-heading">Financly.</p>
      <Link to="/dashboard">
        <p className="navbar-link">Dashboard</p>
      </Link>
    </div>
  );
}

export default Header;

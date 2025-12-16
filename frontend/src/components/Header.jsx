import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "../assets/css/Header.css";
import Logo from "../assets/images/logo.svg";
import { useAuth } from "../context/AuthProvider";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const cartCount = auth?.cart
    ? Object.values(auth.cart).filter(
        (item) =>
          item.status === "waiting" ||
          item.status === "approved" ||
          item.status === "denied"
      ).length
    : 0;


  // Logout
  const handleLogout = () => {
    setAuth({ email: "", pwd: "", country: "", state: "", city: "" });
    setProfileOpen(false);
    navigate("/");
  };

  //search
  const handleSearch = () => {
    const trimmed = search.trim();

    if (trimmed) {
      navigate(`/browse?search=${encodeURIComponent(trimmed)}`);
    } else {
      navigate("/browse");
    }

    setSearch("");
  };


  return (
    <>
      <nav className="header-container">

{/* TOP ROW (Logo + Nav links) */}
        <div className="Navy top-row px-3 px-sm-4 px-md-5 px-lg-5 pt-2 pb-2">

{/* LEFT: Logo */}
          <div className="left-section">
            <Link to="/" className="logo">
              <img width={"100px"} src={Logo} alt="Swapify" />
            </Link>
          </div>

{/* CENTER NAV LINKS */}
          <ul className="nav-links nav-center d-none d-md-flex">
            <li><NavLink to="/" end>Home</NavLink></li>
            <li><NavLink to="/contact">Contact</NavLink></li>
            <li><NavLink to="/browse">Browse</NavLink></li>
          </ul>

{/* RIGHT SIDE (Register OR Profile icon) */}
          <div className="nav-right d-none d-md-flex">
            {!auth.email ? (
              <Link to="/register" className="btn-register">Register</Link>
            ) : (
              <div className="profile-wrapper">
                <div
                  className="profile-icon"
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  <i className="bi bi-person-fill"></i>
                </div>

{/* DROPDOWN */}
                {profileOpen && (
                  <div className="profile-dropdown">
                    <Link to="/account" className="dropdown-item">
                      <i className="bi bi-person"></i> Manage My Account
                    </Link>

                    <Link to="/requests" className="dropdown-item">
                      <i className="bi bi-box-seam"></i> Trading Requests
                    </Link>

                    <Link to="/trades" className="dropdown-item">
                      <i className="bi bi-circle"></i> My Trades
                    </Link>

                    <span className="dropdown-item logout" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-left"></i> Logout
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

{/* Mobile menu button */}
          <i
            className="bi bi-list d-md-none menu-btn"
            onClick={() => setOpen(true)}
          />
        </div>

{/* SECOND ROW */}
        <div className="icons">
          {/* <i className="bi bi-bell fs-5"></i> */}

          <div className="search-box">
            <input
              type="text"
              placeholder="What are you looking for?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <i
              className="bi bi-search fs-5"
              style={{ cursor: "pointer" }}
              onClick={handleSearch}
            ></i>
          </div>


          {/* <Link to='/wishlist'><i className="bi bi-heart fs-5"></i></Link> */}
          <Link to="/cart" className="cart-icon-wrapper">
            <i className="bi bi-cart3 fs-5"></i>

            {auth.email && cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </Link>

        </div>

        <hr/>
      </nav>

{/* Mobile Slide Menu */}
      <div className={`mobile-menu ${open ? "open" : ""}`}>
        <div className="menu-header">
          <i className="bi bi-x-lg close-btn" onClick={() => setOpen(false)}></i>
        </div>

        <hr style={{ border: "1px solid white" }} />

        <ul className="mobile-links text-center">
          <li><NavLink to="/" end onClick={() => setOpen(false)}>Home</NavLink></li>
          <li><NavLink to="/contact" onClick={() => setOpen(false)}>Contact</NavLink></li>
          <li><NavLink to="/browse" onClick={() => setOpen(false)}>Browse</NavLink></li>

          {!auth.email ? (
            <li>
              <Link to="/register" className="btn-register" onClick={() => setOpen(false)}>
                Register
              </Link>
            </li>
          ) : (
            <>
              <li><NavLink to="/account" onClick={() => setOpen(false)}><i className="bi bi-person"></i>  Manage My Account</NavLink></li>
              <li><NavLink to="/requests" onClick={() => setOpen(false)}><i className="bi bi-box-seam"></i>  Trading Requests</NavLink></li>
              <li><NavLink to="/trades" onClick={() => setOpen(false)}><i className="bi bi-circle"></i>  My Trades</NavLink></li>
              <li><span onClick={handleLogout} className="logout-mobile"><i className="bi bi-box-arrow-left"></i>  Logout</span></li>
            </>
          )}
        </ul>
      </div>
    </>
  );
};

export default Header;

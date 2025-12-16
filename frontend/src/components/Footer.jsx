import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/Footer.css";
import Logo from "../assets/images/logo.svg";
import { useAuth } from "../context/AuthProvider";

const Footer = () => {

  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const handleAccountNav = (path) => {
    if (!auth?.email) {
      navigate("/register");
    } else {
      navigate(path);
    }
  };

  return (
    <footer className="Navy footer-section">

      {/* ===== TOP CONTENT ===== */}
      <div className="footer-container">

        {/* SUPPORT */}
        <div className="footer-col">
          <h4>Support</h4>
          <p>kuwait university –<br/> computer scsicence<br/> dedepartment</p>
          <p>swapify@gmail.com</p>
          <p>+965 xxxxxxxx</p>
        </div>

        {/* ACCOUNT */}
        <div className="footer-col">
          <h4>Account</h4>
          <ul>
            <li style={{cursor:"pointer"}} onClick={() => handleAccountNav("/account")}>My Account</li>
            <li style={{cursor:"pointer"}} onClick={() => handleAccountNav("/cart")}>Cart</li>
            <li style={{cursor:"pointer"}} onClick={() => handleAccountNav("/requests")}>Requests</li>
            <li style={{cursor:"pointer"}} onClick={() => handleAccountNav("/trades")}>Trades</li>          </ul>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <Link style={{color:"white", textDecoration:"none"}} to="/browse"><li>Browse</li></Link>
            <Link style={{color:"white", textDecoration:"none"}} to="/contact"><li>Contact us</li></Link>
          </ul>
        </div>

        {/* LOGO + SOCIALS */}
        <div className="footer-logo-col text-center">
          <Link to="/"><img src={Logo} alt="Swapify" className="footer-logo" /></Link>

          <div className="footer-socials">
            <a target="_blank" style={{color: "white"}} rel="noopener noreferrer" href="https://www.facebook.com/p/Kuwait-University-100082952091600/"><i className="bi bi-facebook"></i></a>
            <a target="_blank" style={{color: "white"}} rel="noopener noreferrer" href="https://x.com/K_University"><i className="bi bi-twitter"></i></a>
            <a target="_blank" style={{color: "white"}} rel="noopener noreferrer" href="https://www.instagram.com/kw.university/"><i className="bi bi-instagram"></i></a>
            <a target="_blank" style={{color: "white"}} rel="noopener noreferrer" href="https://www.linkedin.com/school/kuwait-university/"><i className="bi bi-linkedin"></i></a>
          </div>
        </div>

      </div>

      {/* BOTTOM COPYRIGHT */}
      <div className="footer-bottom">
        <p>© Copyright Kuwait University 2025. All right reserved</p>
      </div>

    </footer>
  );
};

export default Footer;
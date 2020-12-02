import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
    <div className="container py-2">    
      <div className="footerCol">
        <h3>Information</h3>
        <ul>
          <li><Link to="#">About Us</Link></li>
          <li><Link to="faq.php">FAQ</Link></li>
          <li><Link to="#">Contact Us</Link></li>
          <li><Link to="#">Privacy Policy</Link></li>
          <li><Link to="#">Terms &amp; Conditions</Link></li>
        </ul>
      </div>
      <div className="footerCol">
        <h3>Customer Service</h3>
        <p>
        <i className="fa fa-clock"></i> 08.30 - 18.00<br />
        <i className="fa fa-phone"></i> +62 21 12345 5678<br />
        <i className="fa fa-envelope"></i> hello@jolika.com
        </p>
      </div>
      <div className="footerCol">
        <h3>Newsletter</h3>
        <p id="footerNewsletter">
          <input type="email" placeholder="Enter Your Email" />
          <button className="btn" type="submit"><i className="fa fa-search"></i></button>
        </p>
        <h3>Connect With Us</h3>
        <p><Link to="#"><i className="fa fa-facebook"></i></Link><Link to="#"><i className="fa fa-instagram"></i></Link><Link to="#"><i className="fa fa-youtube"></i></Link><Link to="#"></Link> <span className="copyright">Copyright &copy; 2020 Jolika</span>
        </p>
      </div>
    </div>
  </footer>
  );
};

export default Footer;

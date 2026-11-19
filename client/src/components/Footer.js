function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-top">
          <div className="site-footer-brand">
            <div className="site-footer-logo">
              <div className="site-logo-icon">B</div>
              <span className="site-logo-name" style={{ color: 'white' }}>Bloomrole</span>
            </div>
            <p className="site-footer-desc">
              Empowering learners worldwide with quality education and skill development through our modern e-learning platform.
            </p>
          </div>

          <div className="site-footer-links">
            <div className="site-footer-col">
              <h4>Platform</h4>
              <ul>
                <li>Browse Courses</li>
                <li>For Students</li>
                <li>For Faculty</li>
                <li>Certificates</li>
              </ul>
            </div>
            <div className="site-footer-col">
              <h4>Company</h4>
              <ul>
                <li>About Us</li>
                <li>Careers</li>
                <li>Blog</li>
                <li>Contact</li>
              </ul>
            </div>
            <div className="site-footer-col">
              <h4>Support</h4>
              <ul>
                <li>Help Center</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Cookie Policy</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="site-footer-bottom">
          <p>&copy; {year} Bloomrole. All rights reserved. Built by Nilay Singh.</p>
          <p className="site-footer-made">Made with love in India 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
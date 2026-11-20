import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="dash-navbar">
      <div className="dash-navbar-inner">
        <div className="site-logo" onClick={() => navigate('/')}>
          <div className="site-logo-icon">B</div>
          <div className="site-logo-text">
            <span className="site-logo-name">Bloomrole</span>
          </div>
        </div>

        <div className="dash-nav-right">
          {user?.role === 'student' && (
            <button className="site-nav-link" onClick={() => navigate('/certificates')}>
              My Certificates
            </button>
          )}
          <div className="site-nav-user">
            <div className="site-nav-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="site-nav-info">
              <span className="site-nav-name">{user?.name}</span>
              <span className="site-nav-role">{user?.role}</span>
            </div>
          </div>
          <button className="site-nav-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
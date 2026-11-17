import { useNavigate, useLocation } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'student') return '/student-dashboard';
    if (user.role === 'faculty') return '/faculty-dashboard';
    return '/admin-dashboard';
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="site-logo" onClick={() => navigate(token ? getDashboardPath() : '/')}>
          <div className="site-logo-icon">B</div>
          <div className="site-logo-text">
            <span className="site-logo-name">Bloomrole</span>
            <span className="site-logo-tagline">Learn. Grow. Succeed.</span>
          </div>
        </div>

        <nav className="site-nav">
          {token ? (
            <div className="site-nav-auth">
              {user?.role === 'student' && (
                <button className="site-nav-link" onClick={() => navigate('/certificates')}>
                  My Certificates
                </button>
              )}
              <button className="site-nav-link" onClick={() => navigate(getDashboardPath())}>
                Dashboard
              </button>
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
          ) : (
            <div className="site-nav-auth">
              {!isAuthPage && (
                <>
                  <button className="site-nav-link" onClick={() => navigate('/login')}>
                    Login
                  </button>
                  <button className="site-nav-btn" onClick={() => navigate('/register')}>
                    Get Started
                  </button>
                </>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
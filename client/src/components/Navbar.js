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
    <nav className="navbar">
      <div className="nav-brand">
        <div className="auth-logo">L</div>
        <span>LearnHub</span>
      </div>
      <div className="nav-right">
        {user?.role === 'student' && (
          <button
            className="nav-link"
            onClick={() => navigate('/certificates')}
          >
            My Certificates
          </button>
        )}
        <span className="nav-user">{user?.name}</span>
        <span className="nav-role">{user?.role}</span>
        <button className="nav-logout" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
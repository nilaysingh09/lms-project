import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import API from '../../api/axios';

function Certificates() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || user?.role !== 'student') {
      navigate('/login');
      return;
    }
    fetchCertificates();
  // eslint-disable-next-line
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await API.get('/certificates/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCertificates(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (certificate) => {
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Georgia, serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: #f5f5f5;
          }
          .certificate {
            background: white;
            width: 800px;
            padding: 60px;
            text-align: center;
            border: 8px solid #5B5FEF;
            position: relative;
          }
          .cert-title {
            font-size: 42px;
            color: #5B5FEF;
            margin-bottom: 10px;
            font-weight: bold;
          }
          .cert-subtitle {
            font-size: 18px;
            color: #666;
            margin-bottom: 40px;
          }
          .cert-text {
            font-size: 18px;
            color: #333;
            margin-bottom: 10px;
          }
          .cert-name {
            font-size: 36px;
            color: #14161A;
            font-weight: bold;
            margin: 20px 0;
            border-bottom: 2px solid #5B5FEF;
            padding-bottom: 10px;
          }
          .cert-course {
            font-size: 24px;
            color: #5B5FEF;
            font-weight: bold;
            margin: 20px 0;
          }
          .cert-date {
            font-size: 16px;
            color: #666;
            margin-top: 40px;
          }
          .cert-code {
            font-size: 13px;
            color: #999;
            margin-top: 20px;
            font-family: monospace;
          }
          .cert-logo {
            font-size: 28px;
            font-weight: bold;
            color: #5B5FEF;
            margin-bottom: 40px;
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="cert-logo">LearnHub</div>
          <div class="cert-title">Certificate of Completion</div>
          <div class="cert-subtitle">This is to certify that</div>
          <div class="cert-name">${certificate.student?.name}</div>
          <div class="cert-text">has successfully completed the course</div>
          <div class="cert-course">${certificate.course?.title}</div>
          <div class="cert-date">
            Issued on: ${new Date(certificate.issuedAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'long', year: 'numeric'
            })}
          </div>
          <div class="cert-code">Verification Code: ${certificate.verificationCode}</div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate-${certificate.course?.title}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="dashboard">
        <h2>My Certificates</h2>
        <p className="subtitle">Your earned certificates</p>

        {certificates.length === 0 ? (
          <div className="empty-state">
            <p>No certificates yet. Complete a course to earn one!</p>
            <button
              className="btn-primary"
              onClick={() => navigate('/student-dashboard')}
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="cert-grid">
            {certificates.map(cert => (
              <div className="cert-card" key={cert._id}>
                <div className="cert-card-icon">C</div>
                <div className="cert-card-info">
                  <h4>{cert.course?.title}</h4>
                  <p>Issued: {new Date(cert.issuedAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}</p>
                  <p className="cert-verify">Code: {cert.verificationCode}</p>
                </div>
                <button
                  className="btn-download"
                  onClick={() => handleDownload(cert)}
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Certificates;
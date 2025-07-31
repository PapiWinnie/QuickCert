import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import AuthContext from '../context/AuthContext.jsx';
import Spinner from '../components/Spinner.jsx';

const DashboardPage = () => {
  const { auth } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalRecords: 0,
    thisMonth: 0,
    pendingReview: 0
  });
  const [recentRecords, setRecentRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('https://quickcert.onrender.com/api/certificates', {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          const now = new Date();
          const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          
          setStats({
            totalRecords: data.length,
            thisMonth: data.filter(record => new Date(record.createdAt) >= thisMonth).length,
            pendingReview: data.filter(record => !record.reviewed).length
          });
          
          setRecentRecords(data.slice(0, 5)); // Get 5 most recent
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [auth.token]);

  const StatCard = ({ title, value, icon, color, description }) => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      border: '1px solid #e5e7eb',
      transition: 'all 0.2s'
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = 'translateY(-2px)';
      e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#6b7280',
            margin: '0 0 8px 0'
          }}>
            {title}
          </p>
          <p style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#111827',
            margin: '0 0 4px 0'
          }}>
            {value}
          </p>
          {description && (
            <p style={{
              fontSize: '12px',
              color: '#9ca3af',
              margin: '0'
            }}>
              {description}
            </p>
          )}
        </div>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px'
        }}>
          {icon}
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ title, description, icon, color, link, gradient }) => (
    <Link to={link} style={{ textDecoration: 'none' }}>
      <div style={{
        background: gradient,
        borderRadius: '16px',
        padding: '32px',
        color: 'white',
        cursor: 'pointer',
        transition: 'all 0.3s',
        height: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-4px) scale(1.02)';
        e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0) scale(1)';
        e.target.style.boxShadow = 'none';
      }}>
        <div>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            marginBottom: '20px'
          }}>
            {icon}
          </div>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '700',
            margin: '0 0 8px 0'
          }}>
            {title}
          </h3>
          <p style={{
            fontSize: '14px',
            opacity: '0.9',
            margin: '0',
            lineHeight: '1.5'
          }}>
            {description}
          </p>
        </div>
        <div style={{
          fontSize: '24px',
          opacity: '0.7'
        }}>
          →
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <Header />
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'calc(100vh - 80px)'
        }}>
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Header />
      <main style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Welcome Section */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: '800',
            color: '#111827',
            margin: '0 0 8px 0'
          }}>
            Welcome back, {auth.role}!
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#6b7280',
            margin: '0'
          }}>
            Here's what's happening with your birth certificate records today.
          </p>
        </div>

        {/* Statistics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          <StatCard
            title="Total Records"
            value={stats.totalRecords}
            icon="📋"
            color="#dbeafe"
            description="All time submissions"
          />
          <StatCard
            title="This Month"
            value={stats.thisMonth}
            icon="📅"
            color="#dcfce7"
            description="New records this month"
          />
          <StatCard
            title="Pending Review"
            value={stats.pendingReview}
            icon="⏳"
            color="#fef3c7"
            description="Awaiting review"
          />
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#111827',
            margin: '0 0 24px 0'
          }}>
            Quick Actions
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            <QuickActionCard
              title="Upload New Certificate"
              description="Extract data from a new birth certificate using OCR technology"
              icon="📤"
              link="/upload"
              gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            />
            <QuickActionCard
              title="View Records"
              description="Browse and manage all submitted birth certificate records"
              icon="📊"
              link="/records"
              gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#111827',
              margin: '0'
            }}>
              Recent Activity
            </h2>
            <Link to="/records" style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#6366f1',
              textDecoration: 'none'
            }}>
              View All →
            </Link>
          </div>
          
          {recentRecords.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#6b7280'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
              <p style={{ fontSize: '16px', margin: '0' }}>No records yet</p>
              <p style={{ fontSize: '14px', margin: '8px 0 0 0' }}>Start by uploading your first certificate</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {recentRecords.map((record, index) => (
                <div key={record._id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    backgroundColor: '#6366f1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginRight: '16px'
                  }}>
                    {index + 1}
                  </div>
                  <div style={{ flex: '1' }}>
                    <p style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#111827',
                      margin: '0 0 4px 0'
                    }}>
                      {record.fullName}
                    </p>
                    <p style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      margin: '0'
                    }}>
                      Certificate #{record.certificateNumber} • {new Date(record.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage; 
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import AuthContext from '../context/AuthContext.jsx';
import Spinner from '../components/Spinner.jsx';

const RecordsPage = ({ hideHeader }) => {
  const { auth } = useContext(AuthContext);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('https://quickcert.onrender.com/api/certificates', {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        if (!res.ok) {
          let data = {};
          try { data = await res.json(); } catch {}
          if (res.status === 403) {
            throw new Error(data.message || "You don't have permission to view this.");
          }
          throw new Error(data.message || 'Failed to fetch records');
        }
        const data = await res.json();
        setRecords(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [auth.token]);

  // Filter records by search
  const filteredRecords = records.filter((rec) =>
    rec.fullName.toLowerCase().includes(search.toLowerCase())
  );

  // Export to CSV function
  const exportToCSV = () => {
    setExporting(true);
    try {
      // Create CSV headers
      const headers = [
        'Full Name',
        'Date of Birth',
        'Place of Birth',
        'Gender',
        'Father Name',
        'Mother Name',
        'Certificate Number',
        'Created Date',
        'Uploaded By'
      ];

      // Create CSV data rows
      const csvData = filteredRecords.map(record => [
        record.fullName || '',
        record.dateOfBirth || '',
        record.placeOfBirth || '',
        record.gender || '',
        record.fatherName || '',
        record.motherName || '',
        record.certificateNumber || '',
        new Date(record.createdAt).toLocaleDateString() || '',
        record.uploadedBy?.fullName || 'Unknown'
      ]);

      // Combine headers and data
      const csvContent = [headers, ...csvData]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `birth_certificates_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
      setError('Failed to export CSV file');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {!hideHeader && <Header />}
      <main style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid #e5e7eb',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px'
          }}>
            <div>
              <h1 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#111827',
                margin: '0 0 8px 0'
              }}>
                All Birth Certificates
              </h1>
              <p style={{
                fontSize: '16px',
                color: '#6b7280',
                margin: '0'
              }}>
                {filteredRecords.length} of {records.length} records
              </p>
            </div>
            <button
              onClick={exportToCSV}
              disabled={exporting || filteredRecords.length === 0}
              style={{
                padding: '12px 24px',
                backgroundColor: exporting || filteredRecords.length === 0 ? '#9ca3af' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: exporting || filteredRecords.length === 0 ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (!exporting && filteredRecords.length > 0) {
                  e.target.style.backgroundColor = '#059669';
                }
              }}
              onMouseLeave={(e) => {
                if (!exporting && filteredRecords.length > 0) {
                  e.target.style.backgroundColor = '#10b981';
                }
              }}
            >
              {exporting ? '⏳' : '📊'} {exporting ? 'Exporting...' : 'Export CSV'}
            </button>
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search by full name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 48px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#6366f1';
                e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            />
            <div style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '18px',
              color: '#9ca3af'
            }}>
              🔍
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid #e5e7eb',
          overflow: 'hidden'
        }}>
          {loading ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 20px'
            }}>
              <Spinner />
            </div>
          ) : error ? (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center'
            }}>
              <p style={{
                color: '#dc2626',
                fontSize: '16px',
                fontWeight: '600',
                margin: '0'
              }}>
                {error}
              </p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div style={{
              padding: '60px 20px',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
              <p style={{ fontSize: '18px', margin: '0 0 8px 0' }}>
                {search ? 'No records found' : 'No birth certificates registered yet'}
              </p>
              <p style={{ fontSize: '14px', margin: '0' }}>
                {search ? 'Try adjusting your search terms' : 'Start by uploading your first certificate'}
              </p>
            </div>
          ) : (
            <div style={{ overflow: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '14px'
              }}>
                <thead>
                  <tr style={{
                    backgroundColor: '#f9fafb',
                    borderBottom: '2px solid #e5e7eb'
                  }}>
                    <th style={{
                      padding: '16px 20px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Full Name
                    </th>
                    <th style={{
                      padding: '16px 20px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Date of Birth
                    </th>
                    <th style={{
                      padding: '16px 20px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Place of Birth
                    </th>
                    <th style={{
                      padding: '16px 20px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Gender
                    </th>
                    <th style={{
                      padding: '16px 20px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Father Name
                    </th>
                    <th style={{
                      padding: '16px 20px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Mother Name
                    </th>
                    <th style={{
                      padding: '16px 20px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Certificate #
                    </th>
                    <th style={{
                      padding: '16px 20px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Created Date
                    </th>
                    <th style={{
                      padding: '16px 20px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Uploaded By
                    </th>
                    <th style={{
                      padding: '16px 20px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record, index) => (
                    <tr key={record._id} style={{
                      borderBottom: '1px solid #f3f4f6',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f9fafb';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                    }}>
                      <td style={{
                        padding: '16px 20px',
                        color: '#111827',
                        fontWeight: '500'
                      }}>
                        {record.fullName}
                      </td>
                      <td style={{
                        padding: '16px 20px',
                        color: '#374151'
                      }}>
                        {record.dateOfBirth}
                      </td>
                      <td style={{
                        padding: '16px 20px',
                        color: '#374151'
                      }}>
                        {record.placeOfBirth}
                      </td>
                      <td style={{
                        padding: '16px 20px',
                        color: '#374151'
                      }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: record.gender === 'Male' ? '#dbeafe' : '#fce7f3',
                          color: record.gender === 'Male' ? '#1e40af' : '#be185d'
                        }}>
                          {record.gender}
                        </span>
                      </td>
                      <td style={{
                        padding: '16px 20px',
                        color: '#374151'
                      }}>
                        {record.fatherName}
                      </td>
                      <td style={{
                        padding: '16px 20px',
                        color: '#374151'
                      }}>
                        {record.motherName}
                      </td>
                      <td style={{
                        padding: '16px 20px',
                        color: '#374151',
                        fontFamily: 'monospace',
                        fontSize: '13px'
                      }}>
                        {record.certificateNumber}
                      </td>
                      <td style={{
                        padding: '16px 20px',
                        color: '#6b7280',
                        fontSize: '13px'
                      }}>
                        {new Date(record.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{
                        padding: '16px 20px',
                        color: '#6b7280',
                        fontSize: '13px'
                      }}>
                        {record.uploadedBy?.fullName || 'Unknown'}
                      </td>
                      <td style={{
                        padding: '16px 20px'
                      }}>
                        <Link to={`/review/${record._id}`} style={{
                          padding: '6px 12px',
                          backgroundColor: '#f3f4f6',
                          color: '#374151',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500',
                          textDecoration: 'none',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#e5e7eb';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#f3f4f6';
                        }}>
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RecordsPage; 
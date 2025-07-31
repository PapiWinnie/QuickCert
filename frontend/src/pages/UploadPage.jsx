import React, { useState, useContext, useRef } from 'react';
import Header from '../components/Header.jsx';
import AuthContext from '../context/AuthContext.jsx';
import Spinner from '../components/Spinner.jsx';
import { useNavigate } from 'react-router-dom';

const initialFields = {
  fullName: '',
  dateOfBirth: '',
  placeOfBirth: '',
  gender: '',
  fatherName: '',
  motherName: '',
  certificateNumber: '',
};

const UploadPage = () => {
  const { auth } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [fields, setFields] = useState(initialFields);
  const [rawText, setRawText] = useState('');
  const [step, setStep] = useState(1); // 1: upload, 2: review, 3: success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef();
  const navigate = useNavigate();

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  // Upload image to OCR endpoint
  const handleUpload = async (e) => {
    e.preventDefault();
    setError('');
    if (!file) {
      setError('Please select an image file.');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('https://quickcert.onrender.com/api/ocr/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        body: formData,
      });
      if (!res.ok) {
        let data = {};
        try { data = await res.json(); } catch {}
        throw new Error(data.message || 'OCR failed');
      }
      const data = await res.json();
      setFields({
        fullName: data.fullName || '',
        dateOfBirth: data.dateOfBirth || '',
        placeOfBirth: data.placeOfBirth || '',
        gender: data.gender || '',
        fatherName: data.fatherName || '',
        motherName: data.motherName || '',
        certificateNumber: data.certificateNumber || '',
      });
      setRawText(data.rawText || '');
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle field edits
  const handleFieldChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  // Submit confirmed data to backend
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('https://quickcert.onrender.com/api/certificates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(fields),
      });
      if (!res.ok) {
        let data = {};
        try { data = await res.json(); } catch {}
        throw new Error(data.message || 'Failed to save record');
      }
      setStep(3);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Reset form to upload another
  const handleReset = () => {
    setFile(null);
    setFields(initialFields);
    setRawText('');
    setStep(1);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Header />
      <main style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '24px 32px',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb'
          }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#111827',
              margin: '0'
            }}>
              {step === 1 && 'Upload Birth Certificate'}
              {step === 2 && 'Review Extracted Data'}
              {step === 3 && 'Success'}
            </h1>
            {step === 2 && (
              <p style={{
                margin: '8px 0 0 0',
                color: '#6b7280',
                fontSize: '14px'
              }}>
                Review and edit the extracted information before saving
              </p>
            )}
          </div>

          {/* Content */}
          <div style={{ padding: '32px' }}>
            {step === 1 && (
              <form onSubmit={handleUpload} style={{ maxWidth: '500px' }}>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '14px'
                  }}>
                    Select Certificate Image
                  </label>
                  <div style={{
                    border: '2px dashed #d1d5db',
                    borderRadius: '8px',
                    padding: '32px',
                    textAlign: 'center',
                    backgroundColor: '#f9fafb',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = '#6366f1';
                    e.target.style.backgroundColor = '#f0f9ff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.backgroundColor = '#f9fafb';
                  }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      disabled={loading}
                    />
                    <div style={{ fontSize: '48px', color: '#9ca3af', marginBottom: '16px' }}>📄</div>
                    <p style={{
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#374151',
                      margin: '0 0 8px 0'
                    }}>
                      {file ? file.name : 'Click to select image'}
                    </p>
                    <p style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      margin: '0'
                    }}>
                      PNG, JPG, or JPEG files only
                    </p>
                  </div>
                </div>
                
                {error && (
                  <div style={{
                    padding: '12px 16px',
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '6px',
                    marginBottom: '24px'
                  }}>
                    <p style={{
                      color: '#dc2626',
                      fontSize: '14px',
                      fontWeight: '500',
                      margin: '0'
                    }}>
                      {error}
                    </p>
                  </div>
                )}
                
                {loading && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                  }}>
                    <Spinner />
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={loading || !file}
                  style={{
                    width: '100%',
                    padding: '12px 24px',
                    backgroundColor: loading || !file ? '#9ca3af' : '#6366f1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: loading || !file ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading && file) {
                      e.target.style.backgroundColor = '#4f46e5';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading && file) {
                      e.target.style.backgroundColor = '#6366f1';
                    }
                  }}
                >
                  {loading ? 'Processing...' : 'Extract Data'}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleSave}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                  {/* Form Fields */}
                  <div>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#111827',
                      margin: '0 0 24px 0',
                      paddingBottom: '12px',
                      borderBottom: '2px solid #e5e7eb'
                    }}>
                      Certificate Information
                    </h3>
                    
                    <div style={{ display: 'grid', gap: '20px' }}>
                      {Object.entries(fields).map(([key, value]) => (
                        <div key={key}>
                          <label style={{
                            display: 'block',
                            marginBottom: '6px',
                            fontWeight: '500',
                            color: '#374151',
                            fontSize: '14px'
                          }}>
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </label>
                          <input
                            type="text"
                            name={key}
                            value={value}
                            onChange={handleFieldChange}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              fontSize: '14px',
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
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* OCR Text */}
                  <div>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#111827',
                      margin: '0 0 24px 0',
                      paddingBottom: '12px',
                      borderBottom: '2px solid #e5e7eb'
                    }}>
                      Raw OCR Text
                    </h3>
                    <p style={{
                      fontSize: '13px',
                      color: '#6b7280',
                      margin: '0 0 16px 0'
                    }}>
                      Reference the original extracted text below
                    </p>
                    <div style={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '16px',
                      height: '400px',
                      overflow: 'auto'
                    }}>
                      <pre style={{
                        margin: '0',
                        fontSize: '12px',
                        lineHeight: '1.5',
                        color: '#475569',
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                      }}>
                        {rawText || 'No text extracted'}
                      </pre>
                    </div>
                  </div>
                </div>

                {error && (
                  <div style={{
                    padding: '12px 16px',
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '6px',
                    marginTop: '24px'
                  }}>
                    <p style={{
                      color: '#dc2626',
                      fontSize: '14px',
                      fontWeight: '500',
                      margin: '0'
                    }}>
                      {error}
                    </p>
                  </div>
                )}

                {loading && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    marginTop: '24px'
                  }}>
                    <Spinner />
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  gap: '16px',
                  marginTop: '32px',
                  paddingTop: '24px',
                  borderTop: '1px solid #e5e7eb'
                }}>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      flex: '1',
                      padding: '12px 24px',
                      backgroundColor: loading ? '#9ca3af' : '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.target.style.backgroundColor = '#059669';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        e.target.style.backgroundColor = '#10b981';
                      }
                    }}
                  >
                    {loading ? 'Saving...' : 'Save Record'}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={loading}
                    style={{
                      flex: '1',
                      padding: '12px 24px',
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.target.style.backgroundColor = '#e5e7eb';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        e.target.style.backgroundColor = '#f3f4f6';
                      }
                    }}
                  >
                    Upload Another
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{
                  fontSize: '64px',
                  marginBottom: '24px'
                }}>✅</div>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#059669',
                  margin: '0 0 16px 0'
                }}>
                  Record Saved Successfully!
                </h2>
                <p style={{
                  fontSize: '16px',
                  color: '#6b7280',
                  margin: '0 0 8px 0'
                }}>
                  The birth certificate data has been saved to the database.
                </p>
                <p style={{
                  fontSize: '14px',
                  color: '#9ca3af',
                  margin: '0 0 32px 0'
                }}>
                  Redirecting to dashboard...
                </p>
                <button
                  onClick={() => navigate('/dashboard')}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#6366f1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#4f46e5';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#6366f1';
                  }}
                >
                  Go to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadPage; 
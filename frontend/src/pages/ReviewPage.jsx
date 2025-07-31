import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import AuthContext from '../context/AuthContext.jsx';
import Spinner from '../components/Spinner.jsx';

const ReviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    placeOfBirth: '',
    gender: '',
    fatherName: '',
    motherName: '',
    certificateNumber: ''
  });

  useEffect(() => {
    const fetchCertificate = async () => {
      setLoading(true);
      setError('');
      try {
        console.log('Fetching certificate with ID:', id);
        const res = await fetch(`https://quickcert.onrender.com/api/certificates/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        
        console.log('Response status:', res.status);
        
        if (!res.ok) {
          let data = {};
          try { data = await res.json(); } catch {}
          console.log('Error response data:', data);
          if (res.status === 404) {
            throw new Error('Certificate not found');
          }
          if (res.status === 403) {
            throw new Error("You don't have permission to view this certificate");
          }
          if (res.status === 400) {
            throw new Error(data.message || 'Invalid certificate ID');
          }
          throw new Error(data.message || 'Failed to fetch certificate');
        }
        
        const data = await res.json();
        console.log('Certificate data received:', data);
        setCertificate(data);
        setFormData({
          fullName: data.fullName || '',
          dateOfBirth: data.dateOfBirth || '',
          placeOfBirth: data.placeOfBirth || '',
          gender: data.gender || '',
          fatherName: data.fatherName || '',
          motherName: data.motherName || '',
          certificateNumber: data.certificateNumber || ''
        });
      } catch (err) {
        console.error('Error fetching certificate:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (auth.token) {
      fetchCertificate();
    }
  }, [id, auth.token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`https://quickcert.onrender.com/api/certificates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        let data = {};
        try { data = await res.json(); } catch {}
        throw new Error(data.message || 'Failed to update certificate');
      }

      const updatedCertificate = await res.json();
      setCertificate(updatedCertificate);
      setSuccess('Certificate updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/records');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container p-6 mx-auto">
          <div className="p-8 bg-white rounded-lg shadow-md">
            <Spinner />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container p-6 mx-auto">
          <div className="p-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
              <h1 className="mb-4 text-2xl font-bold text-red-600">Error</h1>
              <p className="mb-4 text-gray-600">{error}</p>
              <button
                onClick={() => navigate('/records')}
                className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700"
              >
                Back to Records
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container p-6 mx-auto">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Review Certificate</h1>
            <div className="text-sm text-gray-500">
              Certificate #{certificate?.certificateNumber}
            </div>
          </div>

          {success && (
            <div className="p-4 mb-6 text-green-700 bg-green-100 border border-green-400 rounded">
              {success}
            </div>
          )}

          {error && (
            <div className="p-4 mb-6 text-red-700 bg-red-100 border border-red-400 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                  Date of Birth *
                </label>
                <input
                  type="text"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                  placeholder="DD/MM/YYYY"
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Place of Birth */}
              <div>
                <label htmlFor="placeOfBirth" className="block text-sm font-medium text-gray-700">
                  Place of Birth *
                </label>
                <input
                  type="text"
                  id="placeOfBirth"
                  name="placeOfBirth"
                  value={formData.placeOfBirth}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Gender */}
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender *
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Father's Name */}
              <div>
                <label htmlFor="fatherName" className="block text-sm font-medium text-gray-700">
                  Father's Name *
                </label>
                <input
                  type="text"
                  id="fatherName"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Mother's Name */}
              <div>
                <label htmlFor="motherName" className="block text-sm font-medium text-gray-700">
                  Mother's Name *
                </label>
                <input
                  type="text"
                  id="motherName"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Certificate Number */}
              <div>
                <label htmlFor="certificateNumber" className="block text-sm font-medium text-gray-700">
                  Certificate Number *
                </label>
                <input
                  type="text"
                  id="certificateNumber"
                  name="certificateNumber"
                  value={formData.certificateNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ReviewPage; 
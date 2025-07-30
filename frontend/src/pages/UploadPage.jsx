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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container p-6 mx-auto">
        <div className="p-8 bg-white rounded-lg shadow-md max-w-xl mx-auto">
          <h1 className="mb-6 text-3xl font-bold text-gray-800">Upload Certificate</h1>
          {step === 1 && (
            <form onSubmit={handleUpload} className="space-y-6">
              <div>
                <label className="block mb-2 font-medium text-gray-700">Select Image (PNG/JPG):</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={loading}
                />
              </div>
              {error && <p className="text-red-600 text-sm font-semibold">{error}</p>}
              {loading && <Spinner />}
              <button
                type="submit"
                className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Uploading...' : 'Extract & Review'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSave} className="space-y-6">
              <h2 className="text-xl font-bold mb-2">Review & Edit Extracted Data</h2>
              <div className="grid grid-cols-1 gap-4">
                {Object.entries(fields).map(([key, value]) => (
                  <div key={key}>
                    <label className="block mb-1 font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                    <input
                      type="text"
                      name={key}
                      value={value}
                      onChange={handleFieldChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">Raw OCR Text (for reference)</label>
                <textarea
                  value={rawText}
                  readOnly
                  className="block w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 text-gray-600 text-xs"
                  rows={4}
                />
              </div>
              {error && <p className="text-red-600 text-sm font-semibold">{error}</p>}
              {loading && <Spinner />}
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Record'}
                </button>
                <button
                  type="button"
                  className="flex-1 px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  onClick={handleReset}
                  disabled={loading}
                >
                  Upload Another
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-green-600 mb-4">Success!</h2>
              <p className="mb-2">Birth certificate record saved.</p>
              <p className="text-gray-500">Redirecting to dashboard...</p>
              <button
                className="mt-4 px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard Now
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UploadPage; 
import React, { useState, useContext, useEffect } from 'react';
import Header from '../components/Header.jsx';
import AuthContext from '../context/AuthContext.jsx';
import RecordsPage from './RecordsPage.jsx';

const AdminDashboard = () => {
  const { auth } = useContext(AuthContext);
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [officers, setOfficers] = useState([]);
  const [officerLoading, setOfficerLoading] = useState(false);
  const [officerError, setOfficerError] = useState('');
  const [officerSearch, setOfficerSearch] = useState('');

  // Fetch all officers
  useEffect(() => {
    const fetchOfficers = async () => {
      setOfficerLoading(true);
      setOfficerError('');
      try {
        const res = await fetch('https://quickcert.onrender.com/api/auth/officer', {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch officers');
        const data = await res.json();
        setOfficers(data);
      } catch (err) {
        setOfficerError(err.message);
      } finally {
        setOfficerLoading(false);
      }
    };
    fetchOfficers();
  }, [auth.token, status]); // refetch on new officer registration

  // Filter officers by search
  const filteredOfficers = officers.filter((officer) =>
    officer.fullName.toLowerCase().includes(officerSearch.toLowerCase())
  );

  // Delete officer
  const handleDeleteOfficer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this officer?')) return;
    try {
      const res = await fetch(`https://quickcert.onrender.com/api/auth/officer/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      if (!res.ok) throw new Error('Failed to delete officer');
      setOfficers(officers.filter((o) => o._id !== id));
    } catch (err) {
      alert('Error deleting officer: ' + err.message);
    }
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('');
    setError('');
    try {
      const res = await fetch('https://quickcert.onrender.com/api/auth/officer/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        let data = {};
        try { data = await res.json(); } catch {}
        throw new Error(data.message || 'Failed to create officer');
      }
      setStatus('Officer created successfully!');
      setForm({ fullName: '', email: '', password: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container p-6 mx-auto">
        <div className="p-8 bg-white rounded-lg shadow-md max-w-xl mx-auto mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <h2 className="mb-2 text-xl font-semibold">Register a New Registry Officer</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
            <button
              type="submit"
              className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded hover:bg-indigo-700"
            >
              Register Officer
            </button>
            {status && <p className="text-green-600">{status}</p>}
            {error && <p className="text-red-600">{error}</p>}
          </form>
        </div>
        {/* Admin can view all officers below */}
        <div className="p-8 bg-white rounded-lg shadow-md max-w-4xl mx-auto mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">All Registry Officers</h2>
          {/* Officer search input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search officer by full name..."
              value={officerSearch}
              onChange={e => setOfficerSearch(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {officerLoading ? (
            <p>Loading officers...</p>
          ) : officerError ? (
            <p className="text-red-600">{officerError}</p>
          ) : filteredOfficers.length === 0 ? (
            <p>No officers found.</p>
          ) : (
            <table className="min-w-full text-sm text-left text-gray-700 border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 border">Full Name</th>
                  <th className="px-3 py-2 border">Email</th>
                  <th className="px-3 py-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOfficers.map((officer) => (
                  <tr key={officer._id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 border">{officer.fullName}</td>
                    <td className="px-3 py-2 border">{officer.email}</td>
                    <td className="px-3 py-2 border">
                      <button
                        onClick={() => handleDeleteOfficer(officer._id)}
                        className="px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Admin can view all certificates below */}
        <div className="p-8 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">All Birth Certificates</h2>
          <RecordsPage hideHeader />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard; 
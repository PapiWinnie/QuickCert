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

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/certificates', {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        if (!res.ok) {
          let data = {};
          try { data = await res.json(); } catch {}
          // Show a more human-friendly message for 403 errors
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

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideHeader && <Header />}
      <main className="container p-6 mx-auto">
        <div className="p-8 bg-white rounded-lg shadow-md">
          {/* Search input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by full name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {loading ? (
            <Spinner />
          ) : error ? (
            <p className="text-red-600 font-semibold">{error}</p>
          ) : filteredRecords.length === 0 ? (
            <p className="text-gray-600">No birth certificates registered yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-700 border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 border">Full Name</th>
                    <th className="px-3 py-2 border">DOB</th>
                    <th className="px-3 py-2 border">Place</th>
                    <th className="px-3 py-2 border">Gender</th>
                    <th className="px-3 py-2 border">Father</th>
                    <th className="px-3 py-2 border">Mother</th>
                    <th className="px-3 py-2 border">Cert. #</th>
                    <th className="px-3 py-2 border">Created</th>
                    {auth.role !== 'admin' && <th className="px-3 py-2 border">Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((rec) => (
                    <tr key={rec._id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 border">{rec.fullName}</td>
                      <td className="px-3 py-2 border">{rec.dateOfBirth}</td>
                      <td className="px-3 py-2 border">{rec.placeOfBirth}</td>
                      <td className="px-3 py-2 border">{rec.gender}</td>
                      <td className="px-3 py-2 border">{rec.fatherName}</td>
                      <td className="px-3 py-2 border">{rec.motherName}</td>
                      <td className="px-3 py-2 border">{rec.certificateNumber}</td>
                      <td className="px-3 py-2 border">{new Date(rec.createdAt).toLocaleDateString()}</td>
                      {auth.role !== 'admin' && (
                        <td className="px-3 py-2 border">
                          <Link
                            to={`/review/${rec._id}`}
                            className="px-3 py-1 text-xs font-semibold text-white bg-indigo-600 rounded hover:bg-indigo-700"
                          >
                            View/Edit
                          </Link>
                        </td>
                      )}
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
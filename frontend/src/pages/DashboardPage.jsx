import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container p-6 mx-auto">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">Officer Dashboard</h1>
          <p className="mb-6 text-gray-600">
            Welcome to your dashboard. From here you can start the OCR process to extract data from a new certificate or view previously submitted records.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/upload" 
              className="px-6 py-3 font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-center"
            >
              Upload New Certificate
            </Link>
            <Link 
              to="/records" // We will create this page later
              className="px-6 py-3 font-semibold text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-center"
            >
              View Submitted Records
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage; 
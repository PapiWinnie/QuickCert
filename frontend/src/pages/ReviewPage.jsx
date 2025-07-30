import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header.jsx';

const ReviewPage = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container p-6 mx-auto">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">Review Extracted Data</h1>
          <p className="text-gray-600">
            This is where the editable form for certificate <span className="font-semibold">{id}</span> will be.
          </p>
        </div>
      </main>
    </div>
  );
};

export default ReviewPage; 
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-50">
      <h1 className="text-6xl font-bold text-indigo-600">404</h1>
      <p className="mt-4 text-2xl font-semibold text-gray-800">Oops! Page Not Found</p>
      <p className="mt-2 text-gray-600">The page you are looking for doesn't seem to exist.</p>
      <Link
        to="/"
        className="px-6 py-3 mt-8 font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFoundPage; 
import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-100 py-12 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-orange-600 mb-4">401</h1>
        <p className="text-2xl text-gray-700 mb-8">Unauthorized Access</p>
        <p className="text-gray-600 mb-8 max-w-md">
          You don't have permission to access this resource. Please log in with the correct account.
        </p>
        <Link
          to="/login"
          className="inline-block px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;

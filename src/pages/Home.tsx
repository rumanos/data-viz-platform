import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to Data Viz Platform</h1>
      <p className="text-lg text-gray-600 mb-8">Your home for data visualization.</p>
      <div className="flex gap-4">
        <Link to="/login" className="btn btn-primary">Login</Link>
        <Link to="/signup" className="btn btn-accent">Sign Up</Link>
        <Link to="/dashboard" className="btn btn-secondary">Dashboard</Link>
      </div>
    </div>
  );
};

export default Home; 
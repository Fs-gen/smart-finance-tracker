import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <div className="text-9xl font-bold text-neutral-200 dark:text-neutral-800">404</div>
      <h1 className="text-3xl font-bold mt-4 mb-2">Page Not Found</h1>
      <p className="text-neutral-600 dark:text-neutral-400 max-w-md mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary">
        <Home size={18} />
        <span>Back to Home</span>
      </Link>
    </div>
  );
};

export default NotFound;
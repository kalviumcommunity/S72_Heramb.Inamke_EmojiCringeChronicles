import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = memo(() => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-white text-center py-12">
      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-purple to-primary-pink text-transparent bg-clip-text">
        Welcome to Emoji Cringe Chronicles
      </h1>
      <p className="text-lg text-neutral-charcoal mb-8">
        Discover the most hilariously awful emoji combinations!
      </p>
      <div className="space-x-4">
        <Link
          to="/emoji"
          className="inline-block px-6 py-3 bg-primary-purple text-neutral-white rounded-lg hover:bg-opacity-90 transition-colors"
        >
          View Combinations
        </Link>
        {user ? (
          <Link
            to="/add-emoji"
            className="inline-block px-6 py-3 bg-primary-pink text-neutral-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Add New Combination
          </Link>
        ) : (
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-primary-pink text-neutral-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Login to Create
          </Link>
        )}
      </div>
    </div>
  );
});

LandingPage.displayName = 'LandingPage';

export default LandingPage;
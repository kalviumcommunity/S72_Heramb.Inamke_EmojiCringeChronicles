import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import useApi from '../hooks/useApi';

const AuthTest = () => {
  const { user, logout, refreshToken, loading: authLoading } = useAuth();
  const { get, loading: apiLoading, error } = useApi();
  const [userData, setUserData] = useState(null);

  const fetchUserData = async () => {
    try {
      const data = await get('/auth/me');
      setUserData(data);
    } catch (err) {
      console.error('Failed to fetch user data:', err);
    }
  };

  const refreshTokenTest = async () => {
    try {
      const result = await refreshToken();
      if (result.success) {
        alert('Token refreshed successfully!');
      } else {
        alert('Failed to refresh token: ' + result.error);
      }
    } catch (err) {
      console.error('Failed to refresh token:', err);
      alert('Failed to refresh token: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4">Authentication Test</h2>
      
      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h3 className="font-bold text-lg mb-2">Authentication Status</h3>
        {authLoading ? (
          <p>Loading authentication status...</p>
        ) : user ? (
          <div>
            <p className="text-green-600 font-semibold">✅ Authenticated</p>
            <p className="mt-2">
              <strong>Username:</strong> {user.username}<br />
              <strong>Email:</strong> {user.email}<br />
              <strong>ID:</strong> {user.id}
            </p>
          </div>
        ) : (
          <p className="text-red-600 font-semibold">❌ Not authenticated</p>
        )}
      </div>

      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h3 className="font-bold text-lg mb-2">API Test</h3>
        <button
          onClick={fetchUserData}
          disabled={apiLoading || !user}
          className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {apiLoading ? 'Loading...' : 'Fetch User Data'}
        </button>
        
        <button
          onClick={refreshTokenTest}
          disabled={apiLoading || !user}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Test Token Refresh
        </button>
        
        {error && (
          <p className="mt-2 text-red-600">{error}</p>
        )}
        
        {userData && (
          <div className="mt-4 p-3 bg-blue-50 rounded">
            <pre className="whitespace-pre-wrap text-sm">
              {JSON.stringify(userData, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {user && (
        <button
          onClick={logout}
          disabled={authLoading}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          {authLoading ? 'Logging out...' : 'Logout'}
        </button>
      )}
    </div>
  );
};

export default AuthTest; 
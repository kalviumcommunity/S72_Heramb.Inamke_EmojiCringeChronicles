import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const AuthDebug = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState([]);

  const addTestResult = (test, result) => {
    setTestResults(prev => [
      { id: Date.now(), test, result, timestamp: new Date().toLocaleTimeString() },
      ...prev
    ]);
  };

  const testCookies = async () => {
    setLoading(true);
    try {
      // Set a test cookie
      document.cookie = "testCookie=hello; path=/";
      
      // Check if cookie was set
      const hasCookie = document.cookie.includes('testCookie');
      
      addTestResult('Basic Cookie Test', {
        success: hasCookie,
        message: hasCookie ? 'Test cookie set successfully' : 'Failed to set test cookie'
      });
    } catch (error) {
      addTestResult('Basic Cookie Test', {
        success: false,
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const testApiConnection = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/`);
      addTestResult('API Connection', {
        success: true,
        status: response.status,
        data: response.data
      });
    } catch (error) {
      addTestResult('API Connection', {
        success: false,
        status: error.response?.status,
        error: error.message,
        details: error.response?.data
      });
    } finally {
      setLoading(false);
    }
  };

  const testJwtVerification = async () => {
    setLoading(true);
    try {
      // Try both auth methods
      const fallbackToken = localStorage.getItem('fallback-token');
      const headers = fallbackToken ? { Authorization: `Bearer ${fallbackToken}` } : {};
      
      const response = await axios.get(`${API_URL}/auth/test-token`, {
        withCredentials: true,
        headers
      });
      
      setResult(response.data);
      addTestResult('JWT Verification', {
        success: true,
        data: response.data
      });
    } catch (error) {
      setResult({
        error: error.message,
        details: error.response?.data
      });
      
      addTestResult('JWT Verification', {
        success: false,
        status: error.response?.status,
        error: error.message,
        details: error.response?.data
      });
    } finally {
      setLoading(false);
    }
  };

  const testAuthEndpoint = async () => {
    setLoading(true);
    try {
      // Try both auth methods
      const fallbackToken = localStorage.getItem('fallback-token');
      const headers = fallbackToken ? { Authorization: `Bearer ${fallbackToken}` } : {};
      
      const response = await axios.get(`${API_URL}/auth/me`, {
        withCredentials: true,
        headers
      });
      
      setResult(response.data);
      addTestResult('Auth Endpoint', {
        success: true,
        data: response.data
      });
    } catch (error) {
      setResult({
        error: error.message,
        details: error.response?.data
      });
      
      addTestResult('Auth Endpoint', {
        success: false,
        status: error.response?.status,
        error: error.message,
        details: error.response?.data
      });
    } finally {
      setLoading(false);
    }
  };

  const createTestUser = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username: `test_user_${Date.now()}`,
        email: `test_${Date.now()}@example.com`,
        password: 'password123'
      });
      
      // Update result display
      setResult(response.data);
      
      // If token received, store as fallback
      if (response.data?.token) {
        localStorage.setItem('fallback-token', response.data.token);
      }
      
      addTestResult('Create Test User', {
        success: true,
        data: response.data
      });
    } catch (error) {
      setResult({
        error: error.message,
        details: error.response?.data
      });
      
      addTestResult('Create Test User', {
        success: false,
        error: error.message,
        details: error.response?.data
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Auth Debugging Tool</h1>
      
      <div className="flex flex-wrap gap-2 mb-6">
        <button 
          onClick={testCookies}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Test Cookies
        </button>
        
        <button 
          onClick={testApiConnection}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Test API Connection
        </button>
        
        <button 
          onClick={testJwtVerification}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Test JWT Verification
        </button>
        
        <button 
          onClick={testAuthEndpoint}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Test Auth Endpoint
        </button>
        
        <button 
          onClick={createTestUser}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          Create Test User
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Current Result</h2>
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : result ? (
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(result, null, 2)}
            </pre>
          ) : (
            <p className="text-gray-500">Run a test to see results</p>
          )}
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Test History</h2>
          <div className="overflow-auto max-h-96">
            {testResults.length > 0 ? (
              <div className="space-y-4">
                {testResults.map(item => (
                  <div key={item.id} className="border-b pb-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{item.test}</span>
                      <span className="text-sm text-gray-500">{item.timestamp}</span>
                    </div>
                    <div className={`text-sm mt-1 ${item.result.success ? 'text-green-600' : 'text-red-600'}`}>
                      {item.result.success ? '✅ Success' : '❌ Failed'}
                    </div>
                    <pre className="bg-gray-100 p-2 rounded text-xs mt-1 overflow-auto">
                      {JSON.stringify(item.result, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No tests run yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthDebug; 
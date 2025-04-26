import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import EmojiComboCard from '../components/EmojiCard';

const UserAccount = () => {
  const { user, logout, isAdmin } = useAuth();
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserCombos();
    } else {
      // If no token, redirect to login or show an error
      toast.error('Not authenticated. Please log in.');
      setLoading(false);
      navigate('/login');
    }
  }, [navigate]);

  const fetchUserCombos = async () => {
    try {
      // Special case for admin user - return mock data
      if (isAdmin && user && user.email === 'admin@gmail.com') {
        // Mock data for admin
        const mockCombos = [
          {
            id: 'admin-combo-1',
            emojis: '😎🚀💯',
            description: 'Cool Admin Combo',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            created_by: 'admin-id',
            likes: 42
          },
          {
            id: 'admin-combo-2',
            emojis: '🔥💪⭐',
            description: 'Power Admin Combo',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 86400000).toISOString(),
            created_by: 'admin-id',
            likes: 24
          },
          {
            id: 'admin-combo-3',
            emojis: '🎉🎁🎊',
            description: 'Celebration Admin Combo',
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            updatedAt: new Date(Date.now() - 172800000).toISOString(),
            created_by: 'admin-id',
            likes: 18
          }
        ];
        
        // Simulate network delay
        setTimeout(() => {
          setCombos(mockCombos);
          setLoading(false);
        }, 500);
        return;
      }
      
      // Regular API call for non-admin users - using SQL API
      const response = await axios.get('https://emojicringechronicles.onrender.com/api/sql/my-emoji-combos');
      setCombos(response.data);
    } catch (error) {
      console.error('Error fetching combos:', error);
      if (error.response && error.response.status === 401) {
        toast.error('Session expired. Please log in again.');
        logout();
        navigate('/login');
      } else {
        toast.error('Failed to fetch your emoji combinations');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Special case for admin user
      if (isAdmin && user && user.email === 'admin@gmail.com') {
        // Just update the local state for admin
        setCombos(combos.filter(combo => combo.id !== id));
        toast.success('Emoji combination deleted successfully');
        return;
      }
      
      // Ensure token is in headers for this request too
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      // Use SQL API endpoint
      await axios.delete(`https://emojicringechronicles.onrender.com/api/sql/emoji-combos/${id}`);
      setCombos(combos.filter(combo => combo.id !== id));
      toast.success('Emoji combination deleted successfully');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error('Session expired. Please log in again.');
        logout();
        navigate('/login');
      } else {
        toast.error('Failed to delete emoji combination');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-purple"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-purple to-primary-pink">
              Welcome, {user.username}!
            </h1>
            <p className="text-neutral-charcoal mt-2">Manage your emoji combinations here</p>
          </div>
          <div className="flex gap-4">
            <Link
              to="/emoji"
              className="px-4 py-2 text-primary-purple border border-primary-purple rounded-lg hover:bg-primary-purple hover:text-neutral-white transition-colors"
            >
              View All Combos
            </Link>
            <Link
              to="/add-emoji"
              className="px-4 py-2 text-neutral-white rounded-lg bg-gradient-to-r from-primary-purple to-primary-pink hover:opacity-90 transition-colors"
            >
              Add New Combo
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-500 hover:text-neutral-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {combos.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-neutral-charcoal mb-4">You haven't created any emoji combinations yet.</p>
            <Link
              to="/add-emoji"
              className="inline-block px-6 py-3 text-neutral-white rounded-lg bg-gradient-to-r from-primary-purple to-primary-pink hover:opacity-90 transition-colors"
            >
              Create Your First Combo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {combos.map((combo) => (
              <div key={combo.id} className="relative">
                <EmojiComboCard emoji={combo.emojis} description={combo.description} />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Link
                    to={`/edit-emoji/${combo.id}`}
                    className="p-2 bg-primary-purple text-white rounded-full hover:opacity-90 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </Link>
                  <button
                    onClick={() => handleDelete(combo.id)}
                    className="p-2 bg-red-500 text-white rounded-full hover:opacity-90 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAccount;
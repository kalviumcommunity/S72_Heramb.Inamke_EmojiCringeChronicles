import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext'; // Assuming you have this import

const AddEmoji = () => {
    const navigate = useNavigate();
    const { logout } = useAuth(); // Assuming your AuthContext exports logout
    const [formData, setFormData] = useState({
        emojis: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Check authentication on component mount
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Not authenticated. Please log in.');
            navigate('/login');
        } else {
            // Set the token in the headers for all subsequent requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Ensure token is in headers for this request
            const token = localStorage.getItem('token');
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
            
            // Use SQL API endpoint
            await axios.post('https://emojicringechronicles.onrender.com/api/sql/emoji-combos', formData);
            toast.success('Emoji combination added successfully');
            navigate('/account');
        } catch (err) {
            if (err.response && err.response.status === 401) {
                toast.error('Session expired. Please log in again.');
                logout();
                navigate('/login');
            } else {
                setError(err.response?.data?.error || 'Failed to add emoji combination');
                toast.error(err.response?.data?.error || 'Failed to add emoji combination');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-neutral-white flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-purple to-primary-pink">
                        Add New Emoji Combination
                    </h2>
                    <p className="mt-2 text-sm text-neutral-charcoal">
                        Create a new emoji combination
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="emojis" className="block text-sm font-medium text-neutral-charcoal mb-1">
                                Emoji Combination
                            </label>
                            <input
                                id="emojis"
                                name="emojis"
                                type="text"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-primary-purple border-opacity-20 rounded-md placeholder-neutral-charcoal placeholder-opacity-50 text-neutral-charcoal focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple focus:z-10 sm:text-sm bg-neutral-white"
                                placeholder="Enter emoji combination (e.g. 😊🌟)"
                                value={formData.emojis}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-neutral-charcoal mb-1">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-primary-purple border-opacity-20 rounded-md placeholder-neutral-charcoal placeholder-opacity-50 text-neutral-charcoal focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple focus:z-10 sm:text-sm bg-neutral-white"
                                placeholder="Describe what this emoji combination means"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-4">
                        <Link
                            to="/account"
                            className="w-1/2 flex justify-center py-2 px-4 border border-primary-purple text-primary-purple rounded-md hover:bg-primary-purple hover:text-neutral-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-1/2 flex justify-center py-2 px-4 border border-transparent text-neutral-white font-medium rounded-md bg-gradient-to-r from-primary-purple to-primary-pink hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple disabled:opacity-50 transition-colors"
                        >
                            {loading ? 'Adding...' : 'Add Combination'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEmoji;
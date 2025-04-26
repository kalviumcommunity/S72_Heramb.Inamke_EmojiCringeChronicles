import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import EmojiComboCard from "../components/EmojiCard";
import { useAuth } from "../context/AuthContext";

const EmojiComboList = () => {
    const [emojiCombos, setEmojiCombos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const { user, isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    // Set default headers for all axios requests
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            console.log('Setting default Authorization header:', `Bearer ${token}`);
        }
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token && isAdmin) {
                toast.error('Not authenticated. Please log in.');
                navigate('/login');
                return;
            }

            // Use the SQL API endpoint to fetch users
            const response = await axios.get("https://emojicringechronicles.onrender.com/api/sql/users", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUsers(response.data || []);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                toast.error('Session expired. Please log in again.');
                logout();
                navigate('/login');
            } else {
                toast.error('Failed to fetch users');
            }
            setUsers([]);
        }
    };

    const fetchEmojiCombos = async () => {
        try {
            setLoading(true);
            let url;
            
            if (selectedUser) {
                // Use the SQL API endpoint to fetch emoji combos by user
                url = `https://emojicringechronicles.onrender.com/api/sql/user/${selectedUser}/emoji-combos`;
            } else {
                // Use the SQL API endpoint to fetch all emoji combos
                url = "https://emojicringechronicles.onrender.com/api/sql/emoji-combos";
            }
            
            const token = localStorage.getItem('token');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
            
            const response = await axios.get(url, { headers });
            
            // Handle different response formats based on endpoint
            if (selectedUser) {
                setEmojiCombos(response.data?.combos || []);
            } else {
                setEmojiCombos(response.data?.combos || []);
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                toast.error('Session expired. Please log in again.');
                logout();
                navigate('/login');
            } else {
                toast.error('Failed to fetch emoji combinations');
            }
            setEmojiCombos([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, creatorId) => {
        // Allow deletion only if user is admin or if the combo belongs to the current user
        if (!isAdmin && creatorId !== user?.id) {
            toast.error('You can only delete your own combinations');
            return;
        }

        try {
            // Get token from localStorage
            const token = localStorage.getItem('token');
            console.log('Token from localStorage:', token); // Debug log
            
            if (!token) {
                toast.error('Not authenticated. Please log in.');
                navigate('/login');
                return;
            }
            
            // Force refresh the token in headers
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            console.log('Authorization header:', `Bearer ${token}`); // Debug log
            
            // Use the SQL API endpoint for deletion
            const response = await axios.delete(`https://emojicringechronicles.onrender.com/api/sql/emoji-combos/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Delete response:', response); // Debug log
            
            setEmojiCombos(prevCombos => prevCombos.filter(combo => combo.id !== id));
            toast.success('Emoji combination deleted successfully');
        } catch (err) {
            console.error('Delete error details:', err); // Full error logging
            
            if (err.response) {
                console.error('Error response:', err.response.status, err.response.data); // Log response details
                
                if (err.response.status === 401) {
                    toast.error('Session expired. Please log in again.');
                    // Try to refresh token or clear invalid token
                    localStorage.removeItem('token');
                    logout();
                    navigate('/login');
                } else {
                    toast.error(`Failed to delete: ${err.response.data?.message || 'Unknown error'}`);
                }
            } else if (err.request) {
                console.error('Error request:', err.request); // Log request that was made
                toast.error('Network error. Please check your connection.');
            } else {
                console.error('Error message:', err.message); // Log other errors
                toast.error('Failed to delete emoji combination');
            }
        }
    };

    useEffect(() => {
        // Fetch users for everyone, not just admins
        fetchUsers();
        fetchEmojiCombos();
    }, []);

    useEffect(() => {
        fetchEmojiCombos();
    }, [selectedUser]);

    const handleRefresh = () => {
        // Force token refresh before fetching
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        fetchEmojiCombos();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-neutral-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-purple"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-white p-6">
            <nav className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
                <Link
                    to={user ? "/account" : "/"}
                    className="flex items-center px-4 py-2 text-primary-purple hover:text-opacity-80 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    {user ? 'Back to Account' : 'Home'}
                </Link>
                <div className="flex gap-4 items-center">
                    {/* Show user dropdown for everyone, not just admins */}
                    <select
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="px-4 py-2 border border-primary-purple rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple"
                    >
                        <option value="">All Users</option>
                        {users.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.username}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleRefresh}
                        className="px-4 py-2 text-secondary-green border border-secondary-green rounded-lg hover:bg-secondary-green hover:text-neutral-white transition-colors"
                    >
                        Refresh List
                    </button>
                    {user ? (
                        <Link
                            to="/add-emoji"
                            className="px-4 py-2 text-neutral-white rounded-lg bg-gradient-to-r from-primary-purple to-primary-pink hover:opacity-90 transition-colors"
                        >
                            Add New
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            className="px-4 py-2 text-neutral-white rounded-lg bg-gradient-to-r from-primary-purple to-primary-pink hover:opacity-90 transition-colors"
                        >
                            Login to Add
                        </Link>
                    )}
                </div>
            </nav>
            
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary-purple to-primary-pink">
                    Emoji Combinations
                </h1>
                
                {(!emojiCombos || emojiCombos.length === 0) ? (
                    <div className="text-center py-12 bg-neutral-white rounded-lg shadow-md">
                        <p className="text-neutral-charcoal">No emoji combinations yet.</p>
                        {user && (
                            <Link
                                to="/add-emoji"
                                className="mt-4 inline-block px-6 py-3 text-neutral-white rounded-lg bg-gradient-to-r from-primary-purple to-primary-pink hover:opacity-90 transition-colors"
                            >
                                Create First Combination
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {emojiCombos.map((combo) => (
                            <div key={combo.id} className="relative">
                                <EmojiComboCard 
                                    emoji={combo.emojis} 
                                    description={combo.description} 
                                />
                                {(isAdmin || user?.id === combo.created_by) && (
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        {user?.id === combo.created_by && (
                                            <Link
                                                to={`/edit-emoji/${combo.id}`}
                                                className="p-2 bg-primary-purple text-white rounded-full hover:opacity-90 transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                </svg>
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => handleDelete(combo.id, combo.created_by)}
                                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmojiComboList;
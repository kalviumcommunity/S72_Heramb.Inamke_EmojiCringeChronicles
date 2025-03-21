import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import EmojiComboCard from "../components/EmojiCard";
import { useAuth } from "../context/AuthContext";

const EmojiComboList = () => {
    const [emojiCombos, setEmojiCombos] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchEmojiCombos = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:3000/api/emoji-combos");
            setEmojiCombos(response.data.combos);
        } catch (err) {
            toast.error('Failed to fetch emoji combinations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmojiCombos();
    }, []);

    const handleRefresh = () => {
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
                <div className="flex gap-4">
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
                
                {emojiCombos.length === 0 ? (
                    <div className="text-center py-12 bg-neutral-white rounded-lg shadow-md">
                        <p className="text-neutral-charcoal">No emoji combinations yet. Be the first to add one!</p>
                        {user ? (
                            <Link
                                to="/add-emoji"
                                className="mt-4 inline-block px-6 py-3 text-neutral-white rounded-lg bg-gradient-to-r from-primary-purple to-primary-pink hover:opacity-90 transition-colors"
                            >
                                Create First Combination
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                className="mt-4 inline-block px-6 py-3 text-neutral-white rounded-lg bg-gradient-to-r from-primary-purple to-primary-pink hover:opacity-90 transition-colors"
                            >
                                Login to Create
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {emojiCombos.map((combo) => (
                            <EmojiComboCard 
                                key={combo._id} 
                                emoji={combo.emojis} 
                                description={combo.description} 
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmojiComboList;
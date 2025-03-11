import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmojiComboCard from "../components/EmojiCard";

const EmojiComboList = () => {
    const [emojiCombos, setEmojiCombos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchEmojiCombos = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:3000/api/emoji-combos");
            if (!response.ok) {
                throw new Error('Failed to fetch emoji combinations');
            }
            const data = await response.json();
            setEmojiCombos(data.combos);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmojiCombos();
    }, [refreshKey]);

    const handleRefresh = () => {
        setRefreshKey(prevKey => prevKey + 1);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-neutral-white">
                <div className="text-xl text-primary-purple">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-neutral-white">
                <div className="text-xl text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-white p-6">
            <nav className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
                <Link
                    to="/"
                    className="flex items-center px-4 py-2 text-primary-purple hover:text-opacity-80 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    Home
                </Link>
                <div className="flex gap-4">
                    <button
                        onClick={handleRefresh}
                        className="px-4 py-2 text-secondary-green border border-secondary-green rounded-lg hover:bg-secondary-green hover:text-neutral-white transition-colors"
                    >
                        Refresh List
                    </button>
                    <Link
                        to="/add-emoji"
                        className="px-4 py-2 text-neutral-white rounded-lg bg-gradient-to-r from-primary-purple to-primary-pink hover:opacity-90 transition-colors"
                    >
                        Add New
                    </Link>
                </div>
            </nav>
            
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary-purple to-primary-pink">
                    Emoji Combinations
                </h1>
                
                {emojiCombos.length === 0 ? (
                    <div className="text-center py-12 bg-neutral-white rounded-lg shadow-md">
                        <p className="text-neutral-charcoal">No emoji combinations yet. Be the first to add one!</p>
                        <Link
                            to="/add-emoji"
                            className="mt-4 inline-block px-6 py-3 text-neutral-white rounded-lg bg-gradient-to-r from-primary-purple to-primary-pink hover:opacity-90 transition-colors"
                        >
                            Create First Combination
                        </Link>
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
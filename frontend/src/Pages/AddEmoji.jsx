import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddEmoji = () => {
    const [formData, setFormData] = useState({
        emojis: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post('http://localhost:3000/api/emoji-combos', formData);
            toast.success('Emoji combination added successfully!');
            navigate('/account');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to add emoji combination');
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
            <nav className="w-full max-w-md mb-8 flex justify-between items-center">
                <Link
                    to="/account"
                    className="flex items-center px-4 py-2 text-primary-purple hover:text-opacity-80 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    Back to Account
                </Link>
                <Link
                    to="/emoji"
                    className="flex items-center px-4 py-2 text-primary-purple hover:text-opacity-80 transition-colors"
                >
                    View All
                </Link>
            </nav>
            
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-purple to-primary-pink">
                        Create New Combination
                    </h2>
                    <p className="mt-2 text-sm text-neutral-charcoal">
                        Share your most creative (or cringeworthy) emoji combinations!
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
                                placeholder="Enter your emoji combination"
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
                                placeholder="Describe your emoji combination"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                            />
                        </div>
                    </div>

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
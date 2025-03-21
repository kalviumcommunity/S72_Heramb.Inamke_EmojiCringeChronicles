import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const EditEmoji = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        emojis: '',
        description: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEmojiCombo();
    }, [id]);

    const fetchEmojiCombo = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/emoji-combos/${id}`);
            const { emojis, description } = response.data;
            setFormData({ emojis, description });
        } catch (err) {
            setError('Failed to fetch emoji combination');
            toast.error('Failed to fetch emoji combination');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.put(`http://localhost:3000/api/emoji-combos/${id}`, formData);
            toast.success('Emoji combination updated successfully');
            navigate('/account');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update emoji combination');
            toast.error(err.response?.data?.error || 'Failed to update emoji combination');
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-purple"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-white flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-purple to-primary-pink">
                        Edit Emoji Combination
                    </h2>
                    <p className="mt-2 text-sm text-neutral-charcoal">
                        Update your emoji combination
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
                            {loading ? 'Updating...' : 'Update Combination'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEmoji;
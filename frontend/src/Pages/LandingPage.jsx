import { memo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const LandingPage = memo(() => {
  const { user } = useAuth();
  const [featuredCombos, setFeaturedCombos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCombos = async () => {
      try {
        const response = await axios.get('https://emojicringechronicles.onrender.com/api/emoji-combos?limit=3');
        setFeaturedCombos(response.data.combos);
      } catch (error) {
        console.error('Error fetching combos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCombos();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary-purple/10 to-primary-pink/10 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-8">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-purple via-accent-purple to-primary-pink">
                Emoji Cringe Chronicles
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-neutral-charcoal mb-8 max-w-3xl mx-auto">
              Create, share, and discover the most hilariously awful emoji combinations!
            </p>
            <div className="space-x-4 mb-12">
              {user ? (
                <>
                  <Link
                    to="/emoji"
                    className="inline-block px-8 py-4 bg-gradient-to-r from-primary-purple to-accent-purple text-neutral-card rounded-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl text-lg font-medium"
                  >
                    View Combinations
                  </Link>
                  <Link
                    to="/add-emoji"
                    className="inline-block px-8 py-4 bg-gradient-to-r from-primary-pink to-accent-pink text-neutral-card rounded-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl text-lg font-medium"
                  >
                    Create New
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-block px-8 py-4 bg-gradient-to-r from-primary-purple to-accent-purple text-neutral-card rounded-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl text-lg font-medium"
                  >
                    Sign Up Free
                  </Link>
                  <Link
                    to="/login"
                    className="inline-block px-8 py-4 bg-neutral-card border-2 border-primary-purple text-primary-purple rounded-lg hover:bg-primary-purple hover:text-neutral-card transition-all shadow-lg hover:shadow-xl text-lg font-medium"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Combinations */}
      <div className="bg-gradient-to-b from-primary-pink/5 to-primary-purple/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-primary-purple to-primary-pink">
            Featured Combinations
          </h2>
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-purple"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredCombos.map((combo) => (
                <div key={combo._id} className="bg-neutral-card rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition-all hover:shadow-xl border border-primary-purple/10">
                  <p className="text-4xl mb-4">{combo.emojis}</p>
                  <p className="text-neutral-charcoal">{combo.description}</p>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Link
              to="/emoji"
              className="inline-block px-8 py-4 bg-neutral-card text-primary-purple border-2 border-primary-purple rounded-lg hover:bg-primary-purple hover:text-neutral-card transition-all shadow-lg hover:shadow-xl"
            >
              View All Combinations
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-b from-primary-purple/5 to-primary-pink/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-primary-purple to-primary-pink">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-neutral-card rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition-all hover:shadow-xl border border-primary-purple/10">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-2 text-primary-purple">Create</h3>
              <p className="text-neutral-charcoal">
                Design your unique emoji combinations using our intuitive interface
              </p>
            </div>
            <div className="bg-neutral-card rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition-all hover:shadow-xl border border-primary-purple/10">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-xl font-semibold mb-2 text-primary-pink">Share</h3>
              <p className="text-neutral-charcoal">
                Share your creations with the community and see what others think
              </p>
            </div>
            <div className="bg-neutral-card rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition-all hover:shadow-xl border border-primary-purple/10">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold mb-2 text-accent-purple">Discover</h3>
              <p className="text-neutral-charcoal">
                Browse through a collection of creative and hilarious combinations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Emoji Tips Section */}
      <div className="bg-gradient-to-b from-primary-pink/5 to-primary-purple/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-primary-purple to-primary-pink">
            Emoji Tips & Tricks
          </h2>
          <div className="bg-neutral-card rounded-xl shadow-lg p-8 max-w-2xl mx-auto transform hover:shadow-xl transition-all border border-primary-purple/10">
            <h3 className="text-xl font-semibold mb-4 text-primary-purple">How to Access Emojis:</h3>
            <ul className="space-y-4 text-neutral-charcoal">
              <li className="flex items-start bg-neutral-background p-4 rounded-lg">
                <span className="text-2xl mr-4">⊞</span>
                <div>
                  <span className="font-medium block text-primary-purple">Windows:</span>
                  Press Windows key + . (period) or Windows key + ; (semicolon)
                </div>
              </li>
              <li className="flex items-start bg-neutral-background p-4 rounded-lg">
                <span className="text-2xl mr-4">⌘</span>
                <div>
                  <span className="font-medium block text-primary-pink">Mac:</span>
                  Press Command + Control + Space
                </div>
              </li>
              <li className="flex items-start bg-neutral-background p-4 rounded-lg">
                <span className="text-2xl mr-4">📱</span>
                <div>
                  <span className="font-medium block text-accent-purple">Mobile:</span>
                  Use your device's emoji keyboard or tap the emoji icon
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-primary-purple to-primary-pink py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-neutral-card mb-8">
            Ready to Create Your Own Emoji Combinations?
          </h2>
          {!user && (
            <Link
              to="/register"
              className="inline-block px-8 py-4 bg-neutral-card text-primary-purple rounded-lg hover:bg-opacity-90 transition-all text-lg font-medium shadow-lg hover:shadow-xl"
            >
              Get Started Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
});

LandingPage.displayName = 'LandingPage';

export default LandingPage;
import { memo } from 'react';

const LandingPage = memo(() => {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
        Welcome to Emoji Cringe Chronicles
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        Discover the most hilariously awful emoji combinations!
      </p>

      
    </div>
  );
});

LandingPage.displayName = 'LandingPage';

export default LandingPage;

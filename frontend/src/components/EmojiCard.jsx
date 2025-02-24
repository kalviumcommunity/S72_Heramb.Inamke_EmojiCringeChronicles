import { memo } from 'react';
import PropTypes from 'prop-types'; //Import the proptypes

const EmojiCard = memo(({ emoji, title, description }) => {
    return (
        <div className="p-6 border rounded-lg shadow-md bg-white dark:bg-gray-800 transition-colors">
            <h2 className="text-2xl font-bold mb-3 dark:text-white">
                <span className="text-3xl mr-2" role="img" aria-label={title}>{emoji}</span>
                {title}
            </h2>

            
            <p className="text-gray-600 dark:text-gray-300">{description}</p>
        </div>
    );
});

EmojiCard.displayName = 'EmojiCard';

EmojiCard.propTypes = {
    emoji: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
};

export default EmojiCard;
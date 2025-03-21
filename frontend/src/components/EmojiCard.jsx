import PropTypes from 'prop-types';

const EmojiComboCard = ({ emoji, description }) => {
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-primary-purple border-opacity-20">
            <p className="text-4xl mb-4">{emoji}</p>
            <p className="text-neutral-charcoal text-sm">{description}</p>
        </div>
    );
};

EmojiComboCard.propTypes = {
    emoji: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
};

export default EmojiComboCard;
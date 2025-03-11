import React from "react";

const EmojiComboCard = ({ emoji, description }) => {
    return (
        <div className="bg-neutral-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-primary-purple border-opacity-20">
            <p className="text-4xl mb-4">{emoji}</p>
            <p className="text-neutral-charcoal text-sm">{description}</p>
        </div>
    );
};

export default EmojiComboCard;
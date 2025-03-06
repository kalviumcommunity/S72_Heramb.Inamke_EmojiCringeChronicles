import React from "react";

const EmojiComboCard = ({ emoji, description }) => {
    return (
        <div className="p-4 border rounded-lg shadow-md bg-white">
            <p className="text-3xl">{emoji}</p>
            <p className="text-gray-600 mt-2">{description}</p>
        </div>
    );
};

export default EmojiComboCard;

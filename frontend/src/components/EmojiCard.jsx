const EmojiCard = ({ emoji, title, description }) => {
    return (
        <div className="p-4 border rounded-lg shadow-md">
            <h2 className="text-xl font-bold">{emoji} {title}</h2>
            <p className="text-gray-600">{description}</p>
        </div>
    );
};

export default EmojiCard;

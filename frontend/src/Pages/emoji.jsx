import React, { useEffect, useState } from "react";
import EmojiComboCard from "../components/EmojiCard";

const EmojiComboList = () => {
    const [emojiCombos, setEmojiCombos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() =>{
        fetch("http://localhost:3000/api/emoji-combos")
        .then(res => res.json())
        .then(data => setEmojiCombos(data.combos))
        .catch(err => console.log(err))
        .finally(() => setLoading(false))
    }, []);

    console.log(emojiCombos);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
            {emojiCombos.map((combo) => (
                <EmojiComboCard 
                    key={combo._id} 
                    emoji={combo.emojis} 
                    description={combo.description} 
                />
            ))}
        </div>
    );
};

export default EmojiComboList;

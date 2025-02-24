import { Fragment } from 'react';
import LandingPage from './components/LandingPage';
import EmojiCard from "./components/EmojiCard";

function App() {
    return (
        <Fragment>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <LandingPage />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <EmojiCard 
                            emoji="💀" 
                            title="Deadly Combo" 
                            description="When you mix 🤡 and 😭 together..." 
                        />
                        <EmojiCard 
                            emoji="🫠" 
                            title="Cringe Level Max" 
                            description="That moment when you see 🥴 + 💩" 
                        />
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default App;
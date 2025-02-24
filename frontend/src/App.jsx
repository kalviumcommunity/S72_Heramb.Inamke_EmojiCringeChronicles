import LandingPage from './components/LandingPage';
import EmojiCard from "@/components/EmojiCard";

function App() {
    return (
        <div>
            <LandingPage />
            <div className="flex flex-col items-center space-y-4 p-6">
                <EmojiCard emoji="💀" title="Deadly Combo" description="When you mix 🤡 and 😭 together..." />
                <EmojiCard emoji="🫠" title="Cringe Level Max" description="That moment when you see 🥴 + 💩" />
            </div>
        </div>
    );
}

export default App;

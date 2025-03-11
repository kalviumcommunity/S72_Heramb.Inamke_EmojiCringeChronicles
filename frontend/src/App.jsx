import { Fragment } from 'react';
import LandingPage from './Pages/LandingPage';
import EmojiComboList from "./Pages/emoji";
import AddEmoji from "./Pages/AddEmoji";
import {BrowserRouter , Routes, Route} from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/emoji" element={<EmojiComboList />} />
                <Route path="/add-emoji" element={<AddEmoji />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
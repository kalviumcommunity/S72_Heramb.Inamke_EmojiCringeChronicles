import { Fragment } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './Pages/LandingPage';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import EmojiComboList from './Pages/emoji';
import AddEmoji from './Pages/AddEmoji';
import EditEmoji from './Pages/EditEmoji';
import UserAccount from './Pages/UserAccount';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/emoji" element={<EmojiComboList />} />
          <Route
            path="/add-emoji"
            element={
              <ProtectedRoute>
                <AddEmoji />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-emoji/:id"
            element={
              <ProtectedRoute>
                <EditEmoji />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <UserAccount />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
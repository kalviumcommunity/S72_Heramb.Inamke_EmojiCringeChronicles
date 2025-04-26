import { Fragment } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './Pages/LandingPage';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import EmojiComboList from './Pages/emoji';
// import AddEmoji from './Pages/AddEmoji';
import AddEmoji from './components/AddEmoji'
// import EditEmoji from './Pages/EditEmoji';
import EditEmoji from './components/EditEmoji'
import UserAccount from './Pages/UserAccount';
import AuthTest from './components/AuthTest';
import AuthDebug from './components/AuthDebug';

function App() {
  return (
    <Fragment>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/emoji" element={<EmojiComboList />} />
        <Route path="/debug" element={<AuthDebug />} />
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
        <Route
          path="/auth-test"
          element={
            <AuthTest />
          }
        />
      </Routes>
    </Fragment>
  );
}

export default App;
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/account');
    } else {
      toast.error(result.error);
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md space-y-8 bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-primary-purple to-primary-pink">
            Welcome Back!
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-charcoal">
            Ready to create more emoji combinations?
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-charcoal">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-primary-purple border-opacity-20 rounded-md shadow-sm placeholder-neutral-charcoal placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-charcoal">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-primary-purple border-opacity-20 rounded-md shadow-sm placeholder-neutral-charcoal placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <a
              href="https://otp-psi-liard.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-purple hover:text-opacity-80"
            >
              Forgot your password?
            </a>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-purple to-primary-pink hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-neutral-charcoal">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-primary-purple hover:text-opacity-80">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
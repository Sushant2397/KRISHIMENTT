import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { BoltInput } from '../components/auth/BoltInput';
import { BoltButton } from '../components/auth/BoltButton';
import { Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

const Login = () => {
  const { t } = useTranslation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (user) {
      const role = user.role?.toLowerCase();
      const defaultRoute = role === 'farmer' ? '/farmer-dashboard' : '/labour-dashboard';
      navigate(defaultRoute, { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    try {
      setError('');
      setLoading(true);
      const result = await login(data.username, data.password);

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.user) {
        const role = result.user.role?.toLowerCase();
        const defaultRoute = role === 'farmer' ? '/farmer-dashboard' : '/labour-dashboard';
        navigate(from || defaultRoute, { replace: true });
      } else {
        setError(t('Login successful but user data is missing. Please try again.'));
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(t('An error occurred during login. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/login-hero.png" 
            alt="Smart Agriculture - Farmers using technology in the field" 
            className="w-full h-full object-cover"
            loading="eager"
            style={{ display: 'block' }}
            onLoad={() => console.log('Login image loaded successfully')}
            onError={(e) => {
              console.error('Failed to load login image. Path:', e.target.src);
              console.error('Make sure the image exists at: public/images/login-hero.png');
            }}
          />
        </div>
        
        {/* Subtle overlay for better visual integration */}
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-600/10 via-indigo-700/5 to-purple-800/10 pointer-events-none"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo/Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 shadow-lg mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('Welcome Back')}
            </h1>
            <p className="text-gray-600">
              {t('Sign in to continue to your account')}
            </p>
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2"
                role="alert"
              >
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium">{error}</span>
              </motion.div>
            )}

            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <BoltInput
                  label={t('Username')}
                  type="text"
                  icon={<Mail size={20} />}
                  error={errors.username?.message}
                  placeholder={t('Enter your username')}
                  {...register('username')}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <BoltInput
                  label={t('Password')}
                  type="password"
                  icon={<Lock size={20} />}
                  error={errors.password?.message}
                  placeholder={t('Enter your password')}
                  {...register('password')}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center justify-between"
              >
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all cursor-pointer"
                    {...register('rememberMe')}
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                    {t('Remember me')}
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors hover:underline"
                >
                  {t('Forgot password?')}
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <BoltButton 
                  type="submit" 
                  variant="primary" 
                  fullWidth 
                  loading={loading}
                  className="group"
                >
                  <span className="flex items-center justify-center gap-2">
                    {t('Sign In')}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </BoltButton>
              </motion.div>
            </motion.form>

            {/* Divider */}
            <div className="mt-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              <span className="text-xs text-gray-500 uppercase">or</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </div>

            {/* Sign Up Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-center"
            >
              <p className="text-sm text-gray-600">
                {t("Don't have an account?")}{' '}
                <Link
                  to="/signup"
                  className="font-semibold text-green-600 hover:text-green-700 transition-colors inline-flex items-center gap-1 group"
                >
                  {t('Sign up')}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </p>
            </motion.div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-6 text-center text-xs text-gray-500"
          >
            <p>© 2025 Smart Agriculture Platform. All rights reserved.</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

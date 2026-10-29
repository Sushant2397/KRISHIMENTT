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
import { Mail, Lock, ArrowRight, Leaf, AlertCircle, CheckCircle } from 'lucide-react';

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
    <div className="min-h-screen flex bg-background">

      {/* ── Left panel — branding ── */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-primary flex-col justify-between p-12">
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute -bottom-16 -right-16 w-96 h-96 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute top-1/2 left-1/4 w-48 h-48 rounded-full bg-[#F1E8D8]/10 blur-2xl" />
        </div>

        {/* Brand */}
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-16">
            <div className="w-10 h-10 rounded-xl bg-[#F1E8D8] flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">KrishiMent</span>
          </div>
        </div>

        {/* Central content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">
              {t('The Right Hands')}<br />
              <span className="text-[#F1E8D8]">{t('for Every Farm.')}</span>
            </h2>
            <p className="text-primary-foreground/75 text-base leading-relaxed mb-8 max-w-sm">
              {t('Connecting farmers with skilled agricultural workers. Transparent wages, smart matching.')}
            </p>
            {[
              t('Verified worker profiles'),
              t('Location-based job matching'),
              t('Marathi, Hindi & English support'),
            ].map((point, i) => (
              <motion.div
                key={point}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-2.5 text-primary-foreground/80 text-sm mb-2.5"
              >
                <CheckCircle className="w-4 h-4 text-[#F1E8D8] flex-shrink-0" />
                {point}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10">
          <div className="border-t border-white/15 pt-6">
            <p className="text-primary-foreground/60 text-xs">
              © {new Date().getFullYear()} KrishiMent — Agritech Platform
            </p>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-foreground text-base">KrishiMent</span>
          </Link>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">
              {t('Welcome Back')}
            </h1>
            <p className="text-muted-foreground">
              {t('Sign in to continue to your account')}
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 flex items-start gap-2.5 p-3.5 rounded-xl
                         bg-destructive-light border border-destructive/20 text-destructive"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div>
              <label className="form-label" htmlFor="login-username">{t('Username or email')}</label>
              <BoltInput
                id="login-username"
                type="text"
                icon={<Mail size={18} />}
                error={errors.username?.message}
                placeholder={t('Enter your username or email')}
                {...register('username')}
              />
            </div>

            <div>
              <label className="form-label" htmlFor="login-password">{t('Password')}</label>
              <BoltInput
                id="login-password"
                type="password"
                icon={<Lock size={18} />}
                error={errors.password?.message}
                placeholder={t('Enter your password')}
                {...register('password')}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border text-primary
                             focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  {...register('rememberMe')}
                />
                <span className="text-sm text-muted-foreground">{t('Remember me')}</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:text-primary-hover font-medium
                           hover:underline transition-colors"
              >
                {t('Forgot password?')}
              </Link>
            </div>

            <BoltButton
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              className="h-11 text-sm gap-2 group"
            >
              <span className="flex items-center justify-center gap-2">
                {t('Sign In')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </span>
            </BoltButton>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Sign up */}
          <p className="text-center text-sm text-muted-foreground">
            {t("Don't have an account?")}{' '}
            <Link
              to="/signup"
              className="font-semibold text-primary hover:text-primary-hover
                         hover:underline transition-colors inline-flex items-center gap-1 group"
            >
              {t('Sign up')}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

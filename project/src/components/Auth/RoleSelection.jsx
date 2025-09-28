import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { USER_ROLES } from '../../utils/constants';
import { Users, Tractor, Eye, EyeOff, Check, X } from 'lucide-react';

const RoleSelection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  
  const [passwordRequirements, setPasswordRequirements] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    passwordsMatch: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();
  
  // Check password requirements when password changes
  useEffect(() => {
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;
    
    setPasswordRequirements({
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      passwordsMatch: password === confirmPassword && password.length > 0
    });
  }, [formData.password, formData.confirmPassword]);
  
  // Check if all password requirements are met
  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);
  
  // Debug password requirements
  useEffect(() => {
    console.log('Password requirements:', {
      requirements: passwordRequirements,
      allMet: isPasswordValid
    });
  }, [passwordRequirements, isPasswordValid]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleSelect = (role) => {
    setFormData({
      ...formData,
      role
    });
  };

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isPasswordValid) {
      console.log('Password validation failed');
      setError('Please ensure all password requirements are met.');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      console.log('Passwords do not match');
      setError('Passwords do not match.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess(false);
    
    console.log('Form data before submission:', formData);

    try {
      // Format the data for the backend
      const registrationData = {
        username: formData.email.split('@')[0], // Use part of email as username
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        role: formData.role,
        password: formData.password,
        confirm_password: formData.confirmPassword
      };
      
      console.log('Registration data being sent:', registrationData);
      
      // Call the register function from AuthContext
      console.log('Calling register function...');
      const response = await register(registrationData);
      console.log('Register response:', response);
      
      if (response && response.success) {
        console.log('Registration successful, setting success state');
        setSuccess(true);
        // Show success message briefly before redirecting
        setTimeout(() => {
          console.log('Redirecting to dashboard...');
          // Navigate based on role
          if (formData.role === USER_ROLES.FARMER) {
            navigate('/farmer-dashboard');
          } else {
            navigate('/labour-dashboard');
          }
        }, 1500);
      } else if (response && response.error) {
        console.log('Registration error:', response.error);
        // Handle specific error messages
        if (response.details) {
          console.error('Error details:', response.details);
        }
        setError(response.error || 'Registration failed. Please try again.');
      } else {
        console.log('Unknown registration error');
        setError('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Debug form validation
  useEffect(() => {
    console.log('Form validation state:', {
      name: !!formData.name,
      email: !!formData.email,
      phone: !!formData.phone,
      role: !!formData.role,
      isPasswordValid,
      allValid: formData.name && formData.email && formData.phone && formData.role && isPasswordValid
    });
  }, [formData, isPasswordValid]);

  const isFormValid = formData.name && formData.email && formData.phone && formData.role && isPasswordValid;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300">
        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded relative" role="alert">
            <strong className="font-bold">Success! </strong>
            <span className="block sm:inline">Registration successful! Redirecting...</span>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">AG</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Smart Agriculture</h1>
          <p className="text-gray-600">Join our agricultural community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your phone number"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Create Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Create a strong password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {/* Password Requirements */}
            <div className="mt-2 bg-gray-50 p-3 rounded-lg text-xs">
              <p className="font-medium text-gray-700 mb-2">Password must contain:</p>
              <ul className="space-y-1">
                <li className={`flex items-center ${passwordRequirements.hasMinLength ? 'text-green-600' : 'text-gray-500'}`}>
                  {passwordRequirements.hasMinLength ? <Check size={14} className="mr-1.5" /> : <X size={14} className="mr-1.5" />}
                  At least 8 characters
                </li>
                <li className={`flex items-center ${passwordRequirements.hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
                  {passwordRequirements.hasUpperCase ? <Check size={14} className="mr-1.5" /> : <X size={14} className="mr-1.5" />}
                  At least one uppercase letter
                </li>
                <li className={`flex items-center ${passwordRequirements.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                  {passwordRequirements.hasNumber ? <Check size={14} className="mr-1.5" /> : <X size={14} className="mr-1.5" />}
                  At least one number
                </li>
                <li className={`flex items-center ${passwordRequirements.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                  {passwordRequirements.hasSpecialChar ? <Check size={14} className="mr-1.5" /> : <X size={14} className="mr-1.5" />}
                  At least one special character
                </li>
              </ul>
            </div>
          </div>
          
          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formData.confirmPassword && (
              <p className={`mt-1 text-xs ${passwordRequirements.passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                {passwordRequirements.passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleRoleSelect(USER_ROLES.FARMER)}
                className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                  formData.role === USER_ROLES.FARMER
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 hover:border-green-300 hover:bg-green-50'
                }`}
              >
                <Tractor size={32} className="mx-auto mb-2" />
                <p className="font-medium">Farmer</p>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect(USER_ROLES.LABOUR)}
                className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                  formData.role === USER_ROLES.LABOUR
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 hover:border-green-300 hover:bg-green-50'
                }`}
              >
                <Users size={32} className="mx-auto mb-2" />
                <p className="font-medium">Labour</p>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors duration-200 ${
              isFormValid
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
          
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{' '}
            <button 
              type="button" 
              onClick={() => navigate('/login')}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Sign in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RoleSelection;
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { USER_ROLES } from '../utils/constants';

// Form field component for consistent styling
const FormField = ({ 
  id, 
  label, 
  type = 'text', 
  required = false, 
  value, 
  onChange, 
  onBlur, 
  placeholder, 
  autoComplete, 
  error 
}) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={id}
      name={id}
      type={type}
      required={required}
      className={`appearance-none block w-full px-3 py-2 border ${
        error ? 'border-red-500' : 'border-gray-300'
      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm`}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      autoComplete={autoComplete}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

// Password requirement component with improved styling
const PasswordRequirement = ({ label, meets }) => (
  <li className="flex items-start mb-1">
    {meets ? (
      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ) : (
      <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    )}
    <span className={`text-sm ${meets ? 'text-gray-700' : 'text-gray-500'}`}>
      {label}
    </span>
  </li>
);

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: USER_ROLES.FARMER,
  });
  
  const [touched, setTouched] = useState({
    username: false,
    email: false,
    name: false,
    phone: false,
    password: false,
    confirmPassword: false,
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  // Validate form fields
  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'username':
        if (!value.trim()) {
          newErrors.username = 'Username is required';
        } else if (value.length < 3) {
          newErrors.username = 'Username must be at least 3 characters';
        } else {
          delete newErrors.username;
        }
        break;
        
      case 'email':
        if (!value) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;
        
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Full name is required';
        } else {
          delete newErrors.name;
        }
        break;
        
      case 'phone':
        if (!value) {
          newErrors.phone = 'Phone number is required';
        } else if (!/^[0-9+\-\s()]{10,}$/.test(value)) {
          newErrors.phone = 'Please enter a valid phone number';
        } else {
          delete newErrors.phone;
        }
        break;
        
      case 'password':
        if (!value) {
          newErrors.password = 'Password is required';
        } else if (value.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        } else {
          delete newErrors.password;
        }
        break;
        
      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (value !== formData.password) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else {
          delete newErrors.confirmPassword;
        }
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Validate field if it has been touched
    if (touched[name]) {
      validateField(name, newValue);
    }
  };
  
  // Handle blur event
  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    validateField(name, value);
  };
  
  // Check if form is valid
  const isFormValid = () => {
    return (
      formData.username &&
      formData.email &&
      formData.name &&
      formData.phone &&
      formData.password &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword &&
      Object.keys(errors).length === 0
    );
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    // Mark all fields as touched
    const newTouched = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'role') { // Skip role field
        newTouched[key] = true;
      }
    });
    setTouched(newTouched);
    
    // Validate all fields
    let isValid = true;
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'role') { // Skip role field
        isValid = validateField(key, value) && isValid;
      }
    });
    
    if (!isValid) {
      return;
    }
    
    try {
      setLoading(true);
      const result = await register({
        username: formData.username,
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      });
      
      if (result.error) {
        setSubmitError(result.error);
      } else {
        // Redirect based on role after successful registration
        navigate(`/${formData.role === USER_ROLES.FARMER ? 'farmer' : 'labour'}-dashboard`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitError('An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Check password requirements
  const checkPasswordRequirements = (password, confirmPassword) => {
    return {
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[^A-Za-z0-9]/.test(password),
      passwordsMatch: password === confirmPassword && confirmPassword !== ''
    };
  };

  const passwordRequirements = checkPasswordRequirements(formData.password, formData.confirmPassword);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {submitError && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{submitError}</p>
                </div>
              </div>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                id="username"
                label="Username"
                required
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.username && errors.username}
                placeholder="johndoe"
                autoComplete="username"
              />
              
              <FormField
                id="email"
                label="Email address"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && errors.email}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                id="name"
                label="Full Name"
                required
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && errors.name}
                placeholder="John Doe"
                autoComplete="name"
              />
              
              <FormField
                id="phone"
                label="Phone Number"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.phone && errors.phone}
                placeholder="+1 (555) 123-4567"
                autoComplete="tel"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <FormField
                  id="password"
                  label="Password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && errors.password}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>
              
              <div>
                <FormField
                  id="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.confirmPassword && errors.confirmPassword}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>
            </div>
            
            {/* Password Requirements */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Password Requirements:</h4>
              <ul className="space-y-1">
                <PasswordRequirement 
                  label="At least 8 characters" 
                  meets={passwordRequirements.hasMinLength} 
                />
                <PasswordRequirement 
                  label="At least one uppercase letter" 
                  meets={passwordRequirements.hasUpperCase} 
                />
                <PasswordRequirement 
                  label="At least one number" 
                  meets={passwordRequirements.hasNumber} 
                />
                <PasswordRequirement 
                  label="At least one special character" 
                  meets={passwordRequirements.hasSpecialChar} 
                />
                <PasswordRequirement 
                  label="Passwords match" 
                  meets={passwordRequirements.passwordsMatch} 
                />
              </ul>
            </div>
            
            {/* Role Selection */}
            <div className="pt-2">
              <fieldset>
                <legend className="text-sm font-medium text-gray-700 mb-3">I am a:</legend>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className={`relative border rounded-lg p-4 flex flex-col cursor-pointer focus:outline-none ${
                    formData.role === USER_ROLES.FARMER ? 'ring-2 ring-green-500 border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="role"
                        value={USER_ROLES.FARMER}
                        checked={formData.role === USER_ROLES.FARMER}
                        onChange={handleChange}
                        className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                      />
                      <span className="ml-3 block text-sm font-medium text-gray-700">
                        Farmer
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Looking to hire workers and manage your farm</p>
                  </label>
                  
                  <label className={`relative border rounded-lg p-4 flex flex-col cursor-pointer focus:outline-none ${
                    formData.role === USER_ROLES.LABOUR ? 'ring-2 ring-green-500 border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="role"
                        value={USER_ROLES.LABOUR}
                        checked={formData.role === USER_ROLES.LABOUR}
                        onChange={handleChange}
                        className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                      />
                      <span className="ml-3 block text-sm font-medium text-gray-700">
                        Agricultural Worker
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Looking for farming jobs and opportunities</p>
                  </label>
                </div>
              </fieldset>
            </div>
            
            {/* Terms and Conditions */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">
                  I agree to the{' '}
                  <a href="/terms" className="text-green-600 hover:text-green-500">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-green-600 hover:text-green-500">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!isFormValid() || loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  !isFormValid() || loading
                    ? 'bg-green-300 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : 'Create Account'}
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>
            
            <div className="mt-6">
              <Link 
                to="/login" 
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Sign in to your account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

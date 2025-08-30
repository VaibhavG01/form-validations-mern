import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, MapPin, Lock, Eye, EyeOff, Check, X, Sun, Moon, UserCircle, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

// Toast Notification System
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-6 right-6 z-50 space-y-3 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            transform transition-all duration-500 ease-in-out
            ${toast.visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
            p-4 rounded-xl shadow-2xl border backdrop-blur-sm
            ${toast.type === 'success' 
              ? 'bg-emerald-500/90 border-emerald-400 text-white' 
              : toast.type === 'error'
              ? 'bg-red-500/90 border-red-400 text-white'
              : 'bg-blue-500/90 border-blue-400 text-white'
            }
          `}
        >
          <div className="flex items-center gap-3">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            {toast.type === 'info' && <Shield className="w-5 h-5 flex-shrink-0" />}
            <div className="flex-1">
              <p className="font-medium text-sm">{toast.title}</p>
              {toast.message && <p className="text-xs opacity-90 mt-1">{toast.message}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white/60 rounded-full transition-all duration-3000 ease-linear"
              style={{ width: toast.visible ? '0%' : '100%' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// Custom Hook for Toast Management
const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (type, title, message = '') => {
    const id = Date.now() + Math.random();
    const newToast = { id, type, title, message, visible: false };
    
    setToasts(prev => [...prev, newToast]);
    
    // Trigger animation
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, visible: true } : t));
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, visible: false } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 500);
  };

  return { toasts, addToast, removeToast };
};

const App = () => {
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [touched, setTouched] = useState({});
  const { toasts, addToast, removeToast } = useToast();

  const validateField = (id, value) => {
    switch (id) {
      case 'name':
        if (!value) return 'Name is required';
        if (value.length < 2) return 'Name must be at least 2 characters';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name can only contain letters and spaces';
        return '';
      case 'username':
        if (!value) return 'Username is required';
        if (value.length < 3) return 'Username must be at least 3 characters';
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores';
        return '';
      case 'email':
        if (!value) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Please enter a valid email address' : '';
      case 'age':
        if (!value) return 'Age is required';
        const age = parseInt(value);
        if (isNaN(age) || age < 13 || age > 120) return 'Age must be between 13 and 120';
        return '';
      case 'gender':
        return !value ? 'Please select your gender' : '';
      case 'address':
        if (!value) return 'Address is required';
        return value.length < 10 ? 'Address must be at least 10 characters' : '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])/.test(value)) return 'Password must contain a lowercase letter';
        if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain an uppercase letter';
        if (!/(?=.*\d)/.test(value)) return 'Password must contain a number';
        if (!/(?=.*[!@#$%^&*])/.test(value)) return 'Password must contain a special character (!@#$%^&*)';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setInputs((prev) => ({ ...prev, [id]: value }));
    
    if (touched[id]) {
      const error = validateField(id, value);
      setErrors((prev) => ({ ...prev, [id]: error }));
    }
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    setTouched((prev) => ({ ...prev, [id]: true }));
    const error = validateField(id, value);
    setErrors((prev) => ({ ...prev, [id]: error }));
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/(?=.*[a-z])/.test(password)) score++;
    if (/(?=.*[A-Z])/.test(password)) score++;
    if (/(?=.*\d)/.test(password)) score++;
    if (/(?=.*[!@#$%^&*])/.test(password)) score++;
    
    if (score <= 2) return { strength: score * 20, label: 'Weak', color: 'bg-red-500' };
    if (score <= 3) return { strength: score * 20, label: 'Fair', color: 'bg-yellow-500' };
    if (score <= 4) return { strength: score * 20, label: 'Good', color: 'bg-blue-500' };
    return { strength: 100, label: 'Strong', color: 'bg-emerald-500' };
  };

  const handleSubmit = () => {
    const requiredFields = ['name', 'username', 'email', 'age', 'gender', 'address', 'password'];
    const newErrors = {};
    const newTouched = {};
    
    requiredFields.forEach(field => {
      newTouched[field] = true;
      const error = validateField(field, inputs[field]);
      if (error) newErrors[field] = error;
    });

    setTouched(newTouched);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      addToast('success', 'Registration Successful!', 'Welcome to our platform');
      console.log('Form submitted:', inputs);
      setInputs({});
      setTouched({});
      setErrors({});
    } else {
      addToast('error', 'Validation Failed', `Please fix ${Object.keys(newErrors).length} error(s)`);
    }
  };

  const theme = isDarkMode ? {
    bg: 'bg-gray-900',
    cardBg: 'bg-gray-800/50',
    inputBg: 'bg-gray-700/50',
    inputBorder: 'border-gray-600',
    inputFocus: 'focus:border-blue-400',
    text: 'text-gray-100',
    textSecondary: 'text-gray-300',
    textTertiary: 'text-gray-400',
    iconColor: 'text-blue-400'
  } : {
    bg: 'bg-gray-50',
    cardBg: 'bg-white/80',
    inputBg: 'bg-white',
    inputBorder: 'border-gray-300',
    inputFocus: 'focus:border-blue-500',
    text: 'text-gray-900',
    textSecondary: 'text-gray-700',
    textTertiary: 'text-gray-500',
    iconColor: 'text-blue-600'
  };

  const InputField = ({ id, type, label, icon: Icon, placeholder, required = true }) => {
    const hasError = errors[id] && touched[id];
    const isValid = touched[id] && inputs[id] && !errors[id];
    
    return (
      <div className="space-y-2">
        <label htmlFor={id} className={`flex items-center gap-2 text-sm font-semibold ${theme.textSecondary}`}>
          <Icon className={`w-4 h-4 ${theme.iconColor}`} />
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative group">
          <input
            type={type}
            id={id}
            value={inputs[id] || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            required={required}
            className={`
              w-full pl-11 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300
              ${theme.inputBg} ${hasError ? 'border-red-500 bg-red-50/50' : isValid ? 'border-emerald-500' : theme.inputBorder}
              ${theme.inputFocus} focus:outline-none focus:ring-4 focus:ring-blue-500/20
              placeholder-gray-400 ${theme.text} text-sm font-medium
              hover:shadow-lg group-hover:border-blue-400/50
            `}
          />
          <Icon className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
            hasError ? 'text-red-500' : isValid ? 'text-emerald-500' : theme.textTertiary
          }`} />
          {isValid && (
            <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-emerald-500" />
          )}
        </div>
        {hasError && (
          <div className="flex items-center gap-2 text-sm text-red-600 animate-pulse">
            <X className="w-4 h-4" />
            {errors[id]}
          </div>
        )}
      </div>
    );
  };

  const passwordStrength = getPasswordStrength(inputs.password);

  return (
    <div className={`min-h-screen transition-all duration-500 ${theme.bg} ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-40">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`
            p-3 rounded-full border-2 transition-all duration-300 hover:scale-110
            ${isDarkMode 
              ? 'bg-gray-800/50 border-gray-600 text-yellow-400 hover:bg-gray-700/70' 
              : 'bg-white/50 border-gray-300 text-gray-700 hover:bg-white/70'
            }
            backdrop-blur-sm shadow-lg hover:shadow-xl
          `}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className={`${theme.cardBg} backdrop-blur-xl rounded-3xl shadow-2xl border ${
          isDarkMode ? 'border-gray-700/50' : 'border-white/50'
        } overflow-hidden`}>
          
          {/* Header */}
          <div className={`px-8 py-6 ${isDarkMode ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20' : 'bg-gradient-to-r from-blue-100/50 to-purple-100/50'}`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-500/10'}`}>
                <UserCircle className={`w-8 h-8 ${theme.iconColor}`} />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${theme.text}`}>Create Your Account</h1>
                <p className={`${theme.textSecondary} text-sm mt-1`}>Join thousands of satisfied users worldwide</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-8 space-y-8">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200/20">
                <User className={`w-5 h-5 ${theme.iconColor}`} />
                <h2 className={`text-xl font-semibold ${theme.text}`}>Personal Information</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <InputField
                  id="name"
                  type="text"
                  label="Full Name"
                  icon={User}
                  placeholder="Enter your full name"
                />
                
                <InputField
                  id="username"
                  type="text"
                  label="Username"
                  icon={UserCircle}
                  placeholder="Choose a unique username"
                />
              </div>

              <InputField
                id="email"
                type="email"
                label="Email Address"
                icon={Mail}
                placeholder="your.email@example.com"
              />

              <div className="grid md:grid-cols-2 gap-6">
                <InputField
                  id="age"
                  type="number"
                  label="Age"
                  icon={Calendar}
                  placeholder="Enter your age"
                />
                
                <div className="space-y-2">
                  <label htmlFor="gender" className={`flex items-center gap-2 text-sm font-semibold ${theme.textSecondary}`}>
                    <User className={`w-4 h-4 ${theme.iconColor}`} />
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <select
                      id="gender"
                      value={inputs.gender || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`
                        w-full pl-11 pr-8 py-3.5 rounded-xl border-2 transition-all duration-300
                        ${theme.inputBg} ${errors.gender && touched.gender ? 'border-red-500 bg-red-50/50' : touched.gender && inputs.gender && !errors.gender ? 'border-emerald-500' : theme.inputBorder}
                        ${theme.inputFocus} focus:outline-none focus:ring-4 focus:ring-blue-500/20
                        ${theme.text} text-sm font-medium appearance-none cursor-pointer
                        hover:shadow-lg group-hover:border-blue-400/50
                      `}
                    >
                      <option value="">Select your gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                    <User className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                      errors.gender && touched.gender ? 'text-red-500' : touched.gender && inputs.gender && !errors.gender ? 'text-emerald-500' : theme.textTertiary
                    } transition-colors`} />
                    {touched.gender && inputs.gender && !errors.gender && (
                      <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-emerald-500" />
                    )}
                  </div>
                  {errors.gender && touched.gender && (
                    <div className="flex items-center gap-2 text-sm text-red-600 animate-pulse">
                      <X className="w-4 h-4" />
                      {errors.gender}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200/20">
                <MapPin className={`w-5 h-5 ${theme.iconColor}`} />
                <h2 className={`text-xl font-semibold ${theme.text}`}>Contact Information</h2>
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className={`flex items-center gap-2 text-sm font-semibold ${theme.textSecondary}`}>
                  <MapPin className={`w-4 h-4 ${theme.iconColor}`} />
                  Address <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <textarea
                    id="address"
                    value={inputs.address || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your complete address with city, state, and postal code"
                    required
                    rows={3}
                    className={`
                      w-full pl-11 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300
                      ${theme.inputBg} ${errors.address && touched.address ? 'border-red-500 bg-red-50/50' : touched.address && inputs.address && !errors.address ? 'border-emerald-500' : theme.inputBorder}
                      ${theme.inputFocus} focus:outline-none focus:ring-4 focus:ring-blue-500/20
                      placeholder-gray-400 ${theme.text} text-sm font-medium resize-none
                      hover:shadow-lg group-hover:border-blue-400/50
                    `}
                  />
                  <MapPin className={`absolute left-3.5 top-4 w-4 h-4 ${
                    errors.address && touched.address ? 'text-red-500' : touched.address && inputs.address && !errors.address ? 'text-emerald-500' : theme.textTertiary
                  } transition-colors`} />
                  {touched.address && inputs.address && !errors.address && (
                    <Check className="absolute right-3 top-4 w-4 h-4 text-emerald-500" />
                  )}
                </div>
                {errors.address && touched.address && (
                  <div className="flex items-center gap-2 text-sm text-red-600 animate-pulse">
                    <X className="w-4 h-4" />
                    {errors.address}
                  </div>
                )}
              </div>
            </div>

            {/* Security Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200/20">
                <Shield className={`w-5 h-5 ${theme.iconColor}`} />
                <h2 className={`text-xl font-semibold ${theme.text}`}>Security</h2>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className={`flex items-center gap-2 text-sm font-semibold ${theme.textSecondary}`}>
                  <Lock className={`w-4 h-4 ${theme.iconColor}`} />
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={inputs.password || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Create a strong password"
                    required
                    className={`
                      w-full pl-11 pr-12 py-3.5 rounded-xl border-2 transition-all duration-300
                      ${theme.inputBg} ${errors.password && touched.password ? 'border-red-500 bg-red-50/50' : touched.password && inputs.password && !errors.password ? 'border-emerald-500' : theme.inputBorder}
                      ${theme.inputFocus} focus:outline-none focus:ring-4 focus:ring-blue-500/20
                      placeholder-gray-400 ${theme.text} text-sm font-medium
                      hover:shadow-lg group-hover:border-blue-400/50
                    `}
                  />
                  <Lock className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                    errors.password && touched.password ? 'text-red-500' : touched.password && inputs.password && !errors.password ? 'text-emerald-500' : theme.textTertiary
                  } transition-colors`} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme.textTertiary} hover:${theme.textSecondary} transition-all duration-200 hover:scale-110`}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {inputs.password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className={theme.textTertiary}>Password Strength</span>
                      <span className={`font-semibold ${
                        passwordStrength.strength <= 40 ? 'text-red-500' : 
                        passwordStrength.strength <= 60 ? 'text-yellow-500' : 
                        passwordStrength.strength <= 80 ? 'text-blue-500' : 'text-emerald-500'
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${passwordStrength.color}`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {errors.password && touched.password && (
                  <div className="flex items-center gap-2 text-sm text-red-600 animate-pulse">
                    <X className="w-4 h-4" />
                    {errors.password}
                  </div>
                )}
                
                {touched.password && inputs.password && !errors.password && (
                  <div className="flex items-center gap-2 text-sm text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                    Strong password! Your account will be secure.
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                onClick={handleSubmit}
                className={`
                  w-full py-4 px-8 rounded-xl font-bold text-lg text-white
                  bg-gradient-to-r from-blue-600 to-purple-600 
                  hover:from-blue-700 hover:to-purple-700 
                  focus:outline-none focus:ring-4 focus:ring-blue-500/30
                  transform hover:scale-[1.02] active:scale-[0.98] 
                  transition-all duration-200 shadow-xl hover:shadow-2xl
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                `}
              >
                <div className="flex items-center justify-center gap-2">
                  <UserCircle className="w-5 h-5" />
                  Create Account
                </div>
              </button>
              
              <p className={`text-center text-xs ${theme.textTertiary} mt-4`}>
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
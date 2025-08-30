import React, { useState } from 'react';
import { User, Mail, Calendar, MapPin, Lock, Eye, EyeOff, Check, X } from 'lucide-react';

const Toast = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-slide-in ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`}>
      {type === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
      {message}
    </div>
  );
};

const App = () => {
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(null);

  const validateField = (id, value) => {
    switch (id) {
      case 'name':
        return value.length < 2 ? 'Name must be at least 2 characters' : '';
      case 'username':
        return value.length < 3 ? 'Username must be at least 3 characters' : '';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Please enter a valid email' : '';
      case 'age':
        const age = parseInt(value);
        return age < 18 || age > 120 ? 'Age must be between 18 and 120' : '';
      case 'address':
        return value.length < 10 ? 'Address must be at least 10 characters' : '';
      case 'password':
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])/.test(value)) return 'Password must contain lowercase letter';
        if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain uppercase letter';
        if (!/(?=.*\d)/.test(value)) return 'Password must contain a number';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setInputs((prev) => ({ ...prev, [id]: value }));
    
    // Real-time validation
    const error = validateField(id, value);
    setErrors((prev) => ({ ...prev, [id]: error }));
  };

  const handleSubmit = () => {
    
    // Validate all fields
    const newErrors = {};
    const requiredFields = ['name', 'username', 'email', 'age', 'gender', 'address', 'password'];
    
    requiredFields.forEach(field => {
      if (!inputs[field]) {
        newErrors[field] = 'This field is required';
      } else {
        const error = validateField(field, inputs[field]);
        if (error) newErrors[field] = error;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setToast({ message: 'Registration successful!', type: 'success' });
      console.log('Form submitted:', inputs);
      // Reset form
      setInputs({});
    } else {
      setToast({ message: 'Please fix the errors below', type: 'error' });
    }
  };

  const InputField = ({ id, type, label, icon: Icon, placeholder, required = true }) => (
    <div className="space-y-2">
      <label htmlFor={id} className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Icon className="w-4 h-4 text-blue-600" />
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          id={id}
          value={inputs[id] || ''}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors[id] ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
          }`}
        />
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>
      {errors[id] && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <X className="w-4 h-4" />
          {errors[id]}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-5">
      <style jsx>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-300">Join us today and get started</p>
          </div>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6 ">
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
                icon={User}
                placeholder="Choose a username"
              />
            </div>

            <InputField
              id="email"
              type="email"
              label="Email Address"
              icon={Mail}
              placeholder="Enter your email"
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
                <label htmlFor="gender" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <User className="w-4 h-4 text-blue-600" />
                  Gender
                </label>
                <div className="relative">
                  <select
                    id="gender"
                    value={inputs.gender || ''}
                    onChange={handleChange}
                    required
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white ${
                      errors.gender ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                {errors.gender && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <X className="w-4 h-4" />
                    {errors.gender}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="address" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <MapPin className="w-4 h-4 text-blue-600" />
                Address
              </label>
              <div className="relative">
                <textarea
                  id="address"
                  value={inputs.address || ''}
                  onChange={handleChange}
                  placeholder="Enter your full address"
                  required
                  rows={3}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                    errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                />
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              </div>
              {errors.address && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <X className="w-4 h-4" />
                  {errors.address}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Lock className="w-4 h-4 text-blue-600" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={inputs.password || ''}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  required
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <X className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
              {inputs.password && !errors.password && (
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  Strong password!
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
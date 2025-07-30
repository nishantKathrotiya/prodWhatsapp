import React, { useState, useEffect } from 'react';
import s from './ResetPassword.module.css';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { resetPassword } from '../../Services/Operations/Auth';
import { toast } from 'react-hot-toast';

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();
  const { token } = useParams();
  const [errors, setErrors] = useState({});

  // Validate form
  useEffect(() => {
    validateForm();
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { password, confirmPassword } = formData;
    const newErrors = {};

    // Check if all fields are filled
    if (!password || !confirmPassword) {
      newErrors.required = 'Please fill all the fields.';
    }

    // Check password length
    if (password && password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    // Check if passwords match
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation check before submitting
    if (Object.keys(errors).length > 0 || !isFormValid()) return;

    setLoading(true);

    try {
      const response = await resetPassword(token, formData.password, formData.confirmPassword);
      
      if (response.success) {
        setIsSuccess(true);
        // Clear form after successful submission
        setFormData({
          password: '',
          confirmPassword: '',
        });
      } else {
        toast.error(response.message || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    const { password, confirmPassword } = formData;
    return password && confirmPassword && password === confirmPassword && password.length >= 6 && Object.keys(errors).length === 0;
  };

  return (
    <div className={s.resetPasswordBox}>
      <h1 className={s.title}>Reset Password</h1>
      <p>Enter your new password below</p>

      {isSuccess ? (
        <div className={s.successContainer}>
          <div className={s.successIcon}>✓</div>
          <h2>Password Reset Successfully!</h2>
          <p>Your password has been updated successfully.</p>
          <p>You can now login with your new password.</p>
          <button 
            type="button" 
            className={s.active}
            onClick={() => navigate('/')}
          >
            Go to Login
          </button>
        </div>
      ) : loading ? (
        <div className={s.loadingContainer}>
          <div className={s.spinner}></div>
          <h2>Resetting Password...</h2>
          <p>Please wait while we update your password.</p>
        </div>
      ) : (
        <form className={s.formContainer} onSubmit={handleSubmit}>
          <div className={s.fieldContainer}>
            <label htmlFor="password">New Password*</label>
            <div className={s.eyeWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your new password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <span 
                className={s.eye}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </span>
            </div>
            {errors.password && <span className={s.errorText}>{errors.password}</span>}
          </div>

          <div className={s.fieldContainer}>
            <label htmlFor="confirmPassword">Confirm Password*</label>
            <div className={s.eyeWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your new password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              <span 
                className={s.eye}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </span>
            </div>
            {errors.confirmPassword && <span className={s.errorText}>{errors.confirmPassword}</span>}
          </div>

          {errors.required && <span className={s.errorText}>{errors.required}</span>}

          <button 
            type="submit" 
            className={isFormValid() ? s.active : s.disabled}
            disabled={!isFormValid()}
          >
            Reset Password
          </button>

          <div className={s.linkContainer}>
            <span className={s.linkText}>Remember your password? </span>
            <Link to="/" className={s.link}>Login</Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default ResetPassword; 
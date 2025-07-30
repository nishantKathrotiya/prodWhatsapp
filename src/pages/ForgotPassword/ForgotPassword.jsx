import React, { useState, useEffect } from 'react';
import s from './ForgotPassword.module.css';
import { Link } from 'react-router-dom';
import { sendPasswordResetLink } from '../../Services/Operations/Auth';
import { toast } from 'react-hot-toast';

const ForgotPassword = () => {
    const [formData, setFormData] = useState({
        email: '',
        employeeId: '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

      useEffect(() => {
        validateForm();
      }, [formData]);

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Validate form data
    const validateForm = () => {
        const { email, employeeId } = formData;
        const newErrors = {};

        // Check if all fields are filled
        if (!email || !employeeId) {
            newErrors.required = 'Please fill all the fields.';
        }

        // Enhanced Email validation
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (email && !emailPattern.test(email)) {
            newErrors.email = 'Please enter a valid email address.';
        }

        // Enhanced Employee ID validation
        if (employeeId) {
            // Check if it's numeric
            if (!/^\d+$/.test(employeeId)) {
                newErrors.employeeId = 'Employee ID must contain only numbers.';
            }
            // Check minimum length
            else if (employeeId.length < 3) {
                newErrors.employeeId = 'Employee ID must be at least 3 digits.';
            }
            // Check maximum length
            else if (employeeId.length > 10) {
                newErrors.employeeId = 'Employee ID must not exceed 10 digits.';
            }
        }

        setErrors(newErrors);
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.keys(errors).length > 0 || !isFormValid) return;

        setIsSubmitting(true);

        try {
            const response = await sendPasswordResetLink(formData.employeeId, formData.email);
            
            if (response.success) {
                toast.success("Password reset link sent to your email!");
                setIsSuccess(true);
                // Clear form after successful submission
                setFormData({
                    email: '',
                    employeeId: '',
                });
            } else {
                toast.error(response.message || "Failed to send reset link");
            }
        } catch (error) {
            console.error("Forgot password error:", error);
            toast.error(error.response?.data?.message || "Failed to send reset link. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Check if the form is ready for submission (both email and employeeId are valid)
    const isFormValid = formData.email && formData.employeeId && !errors.email && !errors.employeeId;

    return (
        <div className={s.forgotPasswordBox}>
            <h1 className={s.title}>Forgot Password</h1>
            <p>Enter your Employee ID and Email to reset your password</p>

            {isSuccess ? (
                <div className={s.successContainer}>
                    <div className={s.successIcon}>✓</div>
                    <h2>Reset Link Sent!</h2>
                    <p>We've sent a password reset link to your email address.</p>
                    <p>Please check your inbox and click the link to reset your password.</p>
                    <button 
                        type="button" 
                        className={s.active}
                        onClick={() => setIsSuccess(false)}
                    >
                        Send Another Link
                    </button>
                </div>
            ) : (
                <form className={s.formContainer} onSubmit={handleSubmit}>
                <div className={s.fieldContainer}>
                    <label htmlFor="email">Email ID*</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter Your Email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    {errors.email && <p className={s.errorText}>{errors.email}</p>}
                </div>

                <div className={s.fieldContainer}>
                    <label htmlFor="employeeId">Employee ID*</label>
                    <input
                        type="text"
                        id="employeeId"
                        name="employeeId"
                        placeholder="Enter Your Employee ID"
                        value={formData.employeeId}
                        onChange={handleInputChange}
                    />
                    {errors.employeeId && <p className={s.errorText}>{errors.employeeId}</p>}
                </div>

                {errors.required && <p className={s.errorText}>{errors.required}</p>}

                <div className={s.optionContainer}>
                    <button
                        type="submit"
                        className={!isFormValid ? s.disabled : s.active}
                        disabled={isSubmitting || !isFormValid}
                    >
                        {isSubmitting ? (
                            <>
                                <div className={s.buttonSpinner}></div>
                                Sending...
                            </>
                        ) : (
                            'Send Reset Link'
                        )}
                    </button>
                </div>

                <div className={s.optionContainer}>
                    <p className={s.linkText}>
                        Remembered your password? <Link to="/" className={s.link}>Login</Link>
                    </p>
                </div>
            </form>
            )}
        </div>
    );
};

export default ForgotPassword;

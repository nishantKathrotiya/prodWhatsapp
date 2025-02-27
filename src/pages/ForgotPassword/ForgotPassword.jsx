import React, { useState, useEffect } from 'react';
import s from './ForgotPassword.module.css';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [formData, setFormData] = useState({
        email: '',
        employeeId: '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

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

        if (!email || !employeeId) {
            newErrors.required = 'Please fill all the fields.';
        }

        // Basic Email validation
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (email && !emailPattern.test(email)) {
            newErrors.email = 'Please enter a valid email address.';
        }

        // Validate Employee ID (must be numeric)
        if (employeeId && !/^\d+$/.test(employeeId)) {
            newErrors.employeeId = 'Employee ID must be numeric.';
        }

        setErrors(newErrors);
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.keys(errors).length > 0 || !isFormValid) return;


        setIsSubmitting(true);

        // Create the data object for the API call
        const data = {
            email: formData.email,
            employeeId: formData.employeeId,
        };

        // Placeholder for API call
       
    };

    // Check if the form is ready for submission (both email and employeeId are valid)
    const isFormValid = formData.email && formData.employeeId && !errors.email && !errors.employeeId;

    return (
        <div className={s.forgotPasswordBox}>
            <h1 className={s.title}>Forgot Password</h1>
            <p>Enter your Employee ID and Email to reset your password</p>

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
                        {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </div>

                <div className={s.optionContainer}>
                    <p className={s.linkText}>
                        Remembered your password? <Link to="/" className={s.link}>Login</Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;

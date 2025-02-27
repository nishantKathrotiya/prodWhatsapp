import React, { useState, useEffect } from 'react';
import s from './Signup.module.css';
import { Link } from 'react-router-dom';
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

const Signup = () => {
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    employeeId: '',
    department: 'IT',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  // Watch for changes in form data to validate
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
    const { firstName, lastName, email, employeeId, department, password, confirmPassword } = formData;
    const newErrors = {};

    // Check if all fields are filled
    if (!firstName || !lastName || !email || !employeeId || !department || !password || !confirmPassword) {
      newErrors.required = 'Please fill all the fields.';
    }

    // Validate password
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
    if (password && !passwordRegex.test(password)) {
      newErrors.password = 'Password must be between 8 to 15 characters, include letters, numbers, and special characters.';
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      newErrors.passwordMatch = 'Passwords do not match.';
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation check before submitting
    if (Object.keys(errors).length > 0 || !isFormValid()) return;

    // Create the data object
    const data = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      employeeId: formData.employeeId,
      department: formData.department,
      password: formData.password,
    };

    try {
      // API call placeholder
      const response = await fetch('https://your-api-endpoint.com/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Signup failed!');
      }

      const result = await response.json();
      console.log('Signup successful:', result);
      // Handle successful signup (e.g., redirect or show a success message)
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const isFormValid = () => {
    const { firstName, lastName, email, employeeId, department, password, confirmPassword } = formData;
    return (
      firstName &&
      lastName &&
      email &&
      employeeId &&
      department &&
      password &&
      confirmPassword &&
      Object.keys(errors).length === 0
    );
  };

  return (
    <div className={s.loginBox}>
      <h1 className={s.title}>Signup</h1>
      <p>Enter your details and create an account.</p>

      <form className={s.formConatainer} onSubmit={handleSubmit}>
        <div className={s.halfFieldWrapper}>
          <div className={s.halfFieldConatiner}>
            <label htmlFor="firstName">First Name*</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Enter Your First Name"
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </div>

          <div className={s.halfFieldConatiner}>
            <label htmlFor="lastName">Last Name*</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Enter Your Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className={s.fieldConatiner}>
          <label htmlFor="email">Email*</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter Your Email ID"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>

        <div className={s.halfFieldWrapper}>
          <div className={s.halfFieldConatiner}>
            <label htmlFor="employeeId">Employee ID*</label>
            <input
              type="text"
              id="employeeId"
              name="employeeId"
              placeholder="Enter Your Employee ID"
              value={formData.employeeId}
              onChange={handleInputChange}
            />
          </div>

          <div className={s.halfFieldConatiner}>
            <label htmlFor="department">Select Department*</label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
            >
              <option value="IT">IT</option>
              <option value="CE">CE</option>
              <option value="CSE">CSE</option>
            </select>
          </div>
        </div>

        <div className={s.halfFieldWrapper}>
          <div className={s.halfFieldConatiner}>
            <label htmlFor="password">Password*</label>
            <div className={s.eyeWrapper}>
              <input
                type={show ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter Your password"
                value={formData.password}
                onChange={handleInputChange}
              />
              {show ? (
                <IoEyeOffOutline className={s.eye} onClick={() => setShow(!show)} />
              ) : (
                <IoEyeOutline className={s.eye} onClick={() => setShow(!show)} />
              )}
            </div>
            {errors.password && <p className={s.errorText}>{errors.password}</p>}
          </div>

          <div className={s.halfFieldConatiner}>
            <label htmlFor="confirmPassword">Confirm Password*</label>
            <div className={s.eyeWrapper}>
              <input
                type={show1 ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirmation password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              {show1 ? (
                <IoEyeOffOutline className={s.eye} onClick={() => setShow1(!show1)} />
              ) : (
                <IoEyeOutline className={s.eye} onClick={() => setShow1(!show1)} />
              )}
            </div>
            {errors.passwordMatch && <p className={s.errorText}>{errors.passwordMatch}</p>}
          </div>
        </div>

        {errors.required && <p className={s.errorText}>{errors.required}</p>}

        <div className={s.optionConatiener}>
          {
            isFormValid() ? (
              <button type="submit" className={s.active}>
                Signup
              </button>
            ) : (
              <button type="submit" className={s.disabled} disabled={true}>
                Signup
              </button>
            )
          }
        </div>

        <div className={s.optionConatiener}>
          <p className={s.linkText}>
            Already have an account? <Link to="/" className={s.link}>Login</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;

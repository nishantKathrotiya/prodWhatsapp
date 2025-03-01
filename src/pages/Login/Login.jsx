import React, { useState, useEffect } from 'react';
import s from './Login.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { login } from '../../Services/Operations/Auth';
import { useDispatch } from 'react-redux';

const Login = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    password: '',
  });


  const navigate = useNavigate();
  const dispatch = useDispatch();


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
    const { employeeId, password } = formData;
    const newErrors = {};

    // Check if all fields are filled
    if (!employeeId || !password) {
      newErrors.required = 'Please fill all the fields.';
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation check before submitting
    if (Object.keys(errors).length > 0 || !isFormValid()) return;

    // Create the data object for login
    const data = {
      employeeId: formData.employeeId,
      password: formData.password,
    };


    // API call placeholder
    dispatch(login(data.employeeId, data.password, navigate))

  };

  const isFormValid = () => {
    const { employeeId, password } = formData;
    return employeeId && password && Object.keys(errors).length === 0;
  };

  return (
    <div className={s.loginBox}>
      <h1 className={s.title}>Login</h1>
      <p>Enter your employee ID and password</p>

      {
        loading ? (

          <h1>Loading...</h1>

        ) : (

          <form className={s.formConatainer} onSubmit={handleSubmit}>
            <div className={s.fieldConatiner}>
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

            <div className={s.fieldConatiner}>
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

            </div>

            {errors.required && <p className={s.errorText}>{errors.required}</p>}

            <div className={s.optionConatiener}>
              <Link to="/forgot-password" className={s.link}>Forgot Password?</Link>
            </div>

            <div className={s.optionConatiener}>
              {isFormValid() ? (
                <button type="submit" className={s.active}>
                  Login
                </button>
              ) : (
                <button type="submit" className={s.disabled} disabled>
                  Login
                </button>
              )}
            </div>

            <div className={s.optionConatiener}>
              <p className={s.linkText}>
                Don't have an account? <Link to="/signup" className={s.link}>Create one</Link>
              </p>
            </div>
          </form>

        )
      }
    </div>
  );
};

export default Login;

import React, { useEffect, useState } from 'react';
import { InputOtp } from 'primereact/inputotp';
import s from './OneTimePassword.module.css';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { signUp } from '../../Services/Operations/Auth';
import { toast } from 'react-hot-toast'
import { sendOtp } from '../../Services/Operations/Auth'
const OneTimePassword = () => {
    const [otp, setOtp] = useState();
    const { signupData, loading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const dummyNavigate = (str) => { }; // Dummy function to avoid navigation during resend OTP

    useEffect(() => {
        if (!signupData) {
            navigate('/signup');
        }
    }, []);

    const validate = () => {
        if (otp.toString().length != 4) {
            toast.error("Fill Four digit Number");
            return false;
        }
        return true;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }
        const { firstName, lastName, email, employeeId, department, password, confirmPassword, } = signupData;
        dispatch(signUp(firstName, lastName, email, employeeId, department, password, confirmPassword, otp, navigate));
    }

    const handleResend = () => {
        dispatch(sendOtp(signupData.email, dummyNavigate));
    }

    return (
        <>


            <div className={s.loginBox}>
                <h1 className={s.title}>Validate</h1>
                <p>Enter 4 Digit Code sent to Your Email</p>

                {
                    loading ? (<h1>Loading..</h1>) : (

                        <form className={s.formConatainer}>
                            <div className={s.otpContainer}>
                                <div className="card flex justify-content-center">
                                    <InputOtp
                                        value={otp}
                                        onChange={(e) => setOtp(e.value)}
                                        integerOnly
                                        className="inputOtp"  // Apply the custom class to the InputOtp component
                                    />
                                </div>
                            </div>
                            <div className={s.optionConatiener}>
                                <button type="submit" className={s.active} onClick={handleSubmit}>
                                    Submit
                                </button>
                            </div>
                            <div className={s.optionConatiener}>
                                {/*  ToDo: Resend Code */}
                                <p className={s.link} onClick={handleResend}>Resend Code</p>
                            </div>
                        </form>
                    )
                }
            </div>
        </>
    );
}

export default OneTimePassword;

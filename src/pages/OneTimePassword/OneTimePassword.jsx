import React, { useEffect, useState } from 'react';
import { InputOtp } from 'primereact/inputotp';
import s from './OneTimePassword.module.css';  // Import the custom CSS file

const OneTimePassword = () => {
    const [token, setTokens] = useState();

    useEffect(() => {
        console.log(token);
    }, [token]);

    return (
        <>


            <div className={s.loginBox}>
                <h1 className={s.title}>Validate</h1>
                <p>Enter 4 Digit Code sent to Your Email</p>

                <form className={s.formConatainer}>
                    <div className={s.otpContainer}>
                        <div className="card flex justify-content-center">
                            <InputOtp
                                value={token}
                                onChange={(e) => setTokens(e.value)}
                                integerOnly
                                className="inputOtp"  // Apply the custom class to the InputOtp component
                            />
                        </div>
                    </div>
                    <div className={s.optionConatiener}>
                        <button type="submit" className={s.active}>
                            Submit
                        </button>
                    </div>
                    <div className={s.optionConatiener}>
                        <p className={s.link} onClick={()=>console.log('Resend Code')}>Resend Code</p>
                    </div>
                </form>
            </div>
        </>
    );
}

export default OneTimePassword;

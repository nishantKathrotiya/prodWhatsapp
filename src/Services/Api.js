const BASE_URL = "http://localhost:4000"

export const AUTH_ENDPOINTS = {
    SENDOTP_API: BASE_URL + "/api/v1/auth/sendotp",
    SIGNUP_API: BASE_URL + "/api/v1/auth/signup",
    LOGIN_API: BASE_URL + "/api/v1/auth/login",
    RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
    RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
  }

  export const MESSAGE_ENDPOINTS = {
    SEND_ALL: BASE_URL + "/send-all",
  }
  
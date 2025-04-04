const BASE_URL = "http://localhost:4000";

export const AUTH_ENDPOINTS = {
  SENDOTP_API: BASE_URL + "/api/v1/auth/sendotp",
  SIGNUP_API: BASE_URL + "/api/v1/auth/signup",
  LOGIN_API: BASE_URL + "/api/v1/auth/login",
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
};

export const MESSAGE_ENDPOINTS = {
  SEND_ALL: BASE_URL + "/api/v1/wp/send-all",
  STATUS: BASE_URL + "/api/v1/wp/status",
  LOGOUT: BASE_URL + "/api/v1/wp/LOGOUT",
};
export const STUDENTS_ENDPOINS = {
  GET: BASE_URL + "/api/v1/students/get",
  SEND_MESSAGE: BASE_URL + "/api/v1/students/send-message"
};

export const METADATA_API = {
  DIVISON: BASE_URL + "/api/v1/metadata/divison",
  BATCHES: BASE_URL + "/api/v1/metadata/batch",
};
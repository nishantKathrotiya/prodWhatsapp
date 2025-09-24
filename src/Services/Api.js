const BASE_URL = import.meta.env.BACKEND_URL ?? "http://localhost:4000";

export const AUTH_ENDPOINTS = {
  SENDOTP_API: BASE_URL + "/api/v1/auth/sendotp",
  SIGNUP_API: BASE_URL + "/api/v1/auth/signup",
  LOGIN_API: BASE_URL + "/api/v1/auth/login",
  RESETPASSTOKEN_API: BASE_URL + "/api/v1/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/api/v1/auth/reset-password",
  RESTEPASSWORD_LINK: BASE_URL + "/api/v1/auth/send-reset-link",
};

export const MESSAGE_ENDPOINTS = {
  SEND_ALL: BASE_URL + "/api/v1/wp/send-all",
  STATUS: BASE_URL + "/api/v1/wp/status",
  LOGOUT: BASE_URL + "/api/v1/wp/LOGOUT",
};

export const STUDENTS_ENDPOINS = {
  GET: BASE_URL + "/api/v1/students/get",
  SEND_MESSAGE: BASE_URL + "/api/v1/students/send-message",
};

export const METADATA_API = {
  DIVISON: BASE_URL + "/api/v1/metadata/divison",
  BATCHES: BASE_URL + "/api/v1/metadata/batch",
};

export const DIRECT_MESSAGE_API = {
  UPLOAD_CONTACTS: BASE_URL + "/api/v1/direct-message/upload",
  SEND_MESSAGES: BASE_URL + "/api/v1/direct-message/send",
  DOWNLOAD_TEMPLATE: BASE_URL + "/api/v1/direct-message/template",
};

export const HISTORY_API = {
  GET_HISTORY: BASE_URL + "/api/v1/history",
  GET_HISTORY_BY_ID: BASE_URL + `/api/v1/history`,
};

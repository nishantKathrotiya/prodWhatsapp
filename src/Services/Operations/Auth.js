import { toast } from "react-hot-toast";
import { setLoading } from "../../Slices/authSlice";
import { apiConnector } from "../Connect";
import { AUTH_ENDPOINTS } from "../Api";
import { setToken, setUser } from "../../Slices/profileSlice";

export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", AUTH_ENDPOINTS.SENDOTP_API, {
        email,
        checkUserPresent: true,
      });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("OTP Sent Successfully");
      navigate("/verify-email");
    } catch (error) {
      toast.error("Could Not Send OTP");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function signUp(
  firstName,
  lastName,
  email,
  employeeId,
  department,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", AUTH_ENDPOINTS.SIGNUP_API, {
        firstName,
        lastName,
        email,
        employeeId,
        department,
        password,
        confirmPassword,
        otp,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Signup Success");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", AUTH_ENDPOINTS.LOGIN_API, {
        email,
        password,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Login Successful");
      // Read token from cookie (set by backend)
      function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
      }
      const tokenFromCookie = getCookie("token");
      dispatch(setToken(tokenFromCookie));
      dispatch(setUser({ ...response.data.user }));

      localStorage.setItem("user", JSON.stringify(response.data.user));

      setTimeout(() => {
        navigate("/admin");
      }, 1000);
    } catch (error) {
      toast.error(error.message);
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Remove token cookie by setting it to expired
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    navigate("/");
    toast.success("Logged Out");
  };
}

export async function resetPassword(token, password, confirmPassword) {
  try {
    const response = await apiConnector(
      "POST",
      `${AUTH_ENDPOINTS.RESETPASSWORD_API}/${token}`,
      {
        password,
        confirmPassword,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function sendPasswordResetLink(employeeId, email) {
  try {
    const response = await apiConnector(
      "POST",
      AUTH_ENDPOINTS.RESTEPASSWORD_LINK,
      {
        employeeId,
        email,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

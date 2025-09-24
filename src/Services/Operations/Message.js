import { toast } from "react-hot-toast";
import { apiConnector } from "../Connect";
import { MESSAGE_ENDPOINTS } from "../Api";
import { setLoading, setStatus2 } from "../../Slices/profileSlice";

export function checkStatus(setLoading) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    setLoading(true);
    try {
      const response = await apiConnector("GET", MESSAGE_ENDPOINTS.STATUS);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      if (response.data.status) {
        dispatch(setStatus2("READY"));
      } else {
        toast.error("Whtsapp is not connected");
      }
    } catch (error) {
      toast.error("Could't fetch the status");
    }
    toast.dismiss(toastId);
    setLoading(false);
  };
}

export async function sendMessages(
  selectedIds,
  message,
  setLoading,
  setActiveStep
) {
  const toastId = toast.loading("Loading...");
  setLoading(true);

  try {
    const response = await apiConnector("POST", MESSAGE_ENDPOINTS.SEND_ALL, {
      selectedIds,
      message,
    });
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("Messages Sent!");
    setActiveStep(3);
  } catch (error) {
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  setLoading(false);
}

export function disconnectWhtsapp() {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector("GET", MESSAGE_ENDPOINTS.LOGOUT);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      dispatch(setStatus2("DISCONNECTED"));
      toast.success("Disconncetd successfully");
    } catch (error) {
      toast.error(error.message);
    }
    toast.dismiss(toastId);
  };
}

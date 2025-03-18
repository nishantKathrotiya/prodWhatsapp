import { toast } from "react-hot-toast";
import { apiConnector } from "../Connect";
import { MESSAGE_ENDPOINTS } from "../Api";
import { setStatus2 } from "../../Slices/profileSlice";

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
      console.log(" ERROR............", error);
      toast.error("Could't fetch the status");
    }
    toast.dismiss(toastId);
    setLoading(false);
  };
}

export async function sendMessages(selectedIds, setSelectedIds) {
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", MESSAGE_ENDPOINTS.SEND_ALL, {
      selectedIds,
    });
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("Messages Sent!");
    setSelectedIds([]);
  } catch (error) {
    console.log(" ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
}

export async function disconnectWhtsapp() {
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
      console.log(" ERROR............", error);
      toast.error(error.message);
    }
    toast.dismiss(toastId);
  };
}

import { toast } from "react-hot-toast";
import { apiConnector } from "../Connect";
import { MESSAGE_ENDPOINTS } from "../Api";

export async function sendMessages(selectedIds, setSelectedIds) {
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", MESSAGE_ENDPOINTS.SEND_ALL, {selectedIds});
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

import { apiConnector } from "../Connect";
import { toast } from "react-hot-toast";
import { HISTORY_API } from "../Api";

export const getMessageHistory = async (page = 1, limit = 10) => {
  try {
    const response = await apiConnector(
      "GET",
      HISTORY_API.GET_HISTORY,
      null,
      null,
      { page, limit }
    );
    if (response.data.success) {
      return response.data;
    } else {
      toast.error(response.data.message);
      return null;
    }
  } catch (error) {
    toast.error("Error fetching message history");
    throw error;
  }
};

export const getMessageHistoryById = async (id) => {
  try {
    const response = await apiConnector(
      "GET",
      `${HISTORY_API.GET_HISTORY_BY_ID}/${id}`
    );
    if (response.data.success) {
      return response.data.data;
    } else {
      toast.error(response.data.message);
      return null;
    }
  } catch (error) {
    toast.error("Error fetching message details");
    throw error;
  }
};

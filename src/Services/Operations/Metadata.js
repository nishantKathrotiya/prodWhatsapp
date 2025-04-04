import { toast } from "react-hot-toast";
import { apiConnector } from "../Connect";
import { METADATA_API } from "../Api";

export async function getDivison(department, year, setDivisions) {
  const toastId = toast.loading("Loading...");

  try {
    const response = await apiConnector( "GET", METADATA_API.DIVISON + `?department=${department}&year=${year}` );
    console.log(response.data.success);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    setDivisions(response.data.divisions);
  } catch (error) {
    console.log(" ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
}

export async function getbatches(department, year,divison, setBatches) {
  const toastId = toast.loading("Loading...");

  try {
    const response = await apiConnector( "GET", METADATA_API.BATCHES + `?department=${department}&year=${year}&division=${divison}` );
    console.log(response.data.success);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    setBatches(response.data.batches);
  } catch (error) {
    console.log(" ERROR............", error);
    toast.error("Could't fetch the status");
  }
  toast.dismiss(toastId);
}

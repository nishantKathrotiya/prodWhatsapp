import { toast } from "react-hot-toast";
import { apiConnector } from "../Connect";
import { STUDENTS_ENDPOINS } from "../Api";

export async function getStudents(setStudents, setLoading, queryParams) {
  const toastId = toast.loading("Loading...");
  setLoading(true);

  const { department, year, divison, batch, myCounselling } = queryParams;

  let queryString = "";

  // Check if each filter value is not 'all' before adding it to the query string
  if (department) queryString += `department=${department}&`;
  if (year) queryString += `year=${year}&`;
  if (divison && divison !== "all") queryString += `division=${divison}&`;
  if (batch && batch !== "all") queryString += `batch=${batch}&`;
  if (myCounselling) queryString += `myCounselling=${myCounselling}&`;

  // Remove trailing '&' if there's one
  queryString = queryString.slice(0, -1);

  try {
    // Make the API call with the constructed query string
    const response = await apiConnector(
      "GET",
      `${STUDENTS_ENDPOINS.GET}?${queryString}`
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    if (response.data.data.length === 0) {
      throw new Error("No Students with this Filter");
    }
    setStudents(response.data.data);
    toast.success(`${response.data.data.length} Students Found`)
  } catch (error) {
    console.log(" ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  setLoading(false);
}

import axios from "axios";
import { toast } from "react-toastify";

const getData = async (endpoint: string, options: any = {}) => {
  try {
    const { data } = await axios(endpoint, {
      withCredentials: true,
    });
    return { data, error: undefined };
  } catch (error: any) {
    process.env.NODE_ENV === "development" && console.log(error);
    toast.error(error.response.data.message);
    return { data: [], error };
  }
};

export default getData;
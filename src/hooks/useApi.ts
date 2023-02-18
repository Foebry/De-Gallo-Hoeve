import axios from 'axios';
import { toast } from 'react-toastify';
import logger from 'src/utils/logger';

const getData = async (endpoint: string, options: any = {}) => {
  try {
    const { data } = await axios(endpoint, {
      withCredentials: true,
    });
    return { data, error: undefined };
  } catch (error: any) {
    process.env.NODE_ENV === 'development' && logger.info(error);
    // toast.error(error.response.data.message);
    return { data: [], error };
  }
};

export default getData;

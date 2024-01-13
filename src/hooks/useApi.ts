import axios from 'axios';
import { toast } from 'react-toastify';
import { ApiResponse } from 'src/utils/axios';
import logger from 'src/utils/logger';

const getData = async <T>(endpoint: string, options: any = {}): Promise<ApiResponse<T>> => {
  let data: T | undefined;
  try {
    const { data } = await axios(endpoint, {
      withCredentials: true,
    });
    return { data, error: undefined };
  } catch (error: any) {
    process.env.NODE_ENV === 'development' && logger.info(error);
    error.code = error.response.status;
    // toast.error(error.response.data.message);
    return { data, error };
  }
};

export default getData;

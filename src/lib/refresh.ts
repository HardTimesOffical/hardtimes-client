import axios from 'axios';

export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/refresh`,
      { withCredentials: true } // Обязательно для передачи куки с Refresh Token
    );
    
    if (res.data && res.data.accessToken) {
      return res.data.accessToken;
    }
    return null;
  } catch (e) {
    // Важно выбросить ошибку дальше, чтобы сработал logout во внешнем коде
    throw e; 
  }
};

export default refreshAccessToken;
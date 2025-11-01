import Cookies from "js-cookie";

interface TokenData {
  accessToken: string;
  refreshToken?: string;
}

const getToken = (): TokenData | null => {
  try {
    const authCookie = Cookies.get("RT_SR");
    if (authCookie) {
      return JSON.parse(authCookie);
    }
    return null;
  } catch (error) {
    return null;
  }
};

const setToken = (accessToken: string, refreshToken?: string) => {
  try {
    const tokenData: TokenData = {
      accessToken,
      refreshToken,
    };
    Cookies.set("RT_SR", JSON.stringify(tokenData), {
      expires: 7,
    });
  } catch (error) {
  }
};

const removeToken = () => {
  Cookies.remove("RT_SR");
};

const TokenService = {
  getToken,
  setToken,
  removeToken,
};

export default TokenService;


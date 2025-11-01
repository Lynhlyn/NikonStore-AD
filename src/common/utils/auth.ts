'use server';
import { cookies } from "next/headers";

export async function getAuthFromCookie() {
  const cookieStore = cookies();
  const cookieName = "RT_SR";
  const authCookie = cookieStore.get(cookieName);

  try {
    if (!authCookie?.value) return null;

    const tokenData = JSON.parse(authCookie.value);

    if (!tokenData || !tokenData.accessToken) {
      return null;
    }

    return {
      token: {
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken
      },
      isAuthenticated: !!tokenData.accessToken
    };
  } catch (error) {
    return null;
  }
}


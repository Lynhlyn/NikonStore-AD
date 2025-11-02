import { routerApp } from '@/router';
import { usePathname, useRouter } from 'next/navigation';
import { isValidRolePathName } from '../utils/pathname';

const useAppNavigation = () => {
  const router = useRouter();
  const pathname = usePathname()
  const goToHome = () => {
    const path = getRouteWithRole(routerApp.dashboard.dashboard);
    router.replace(path);
  };

  const goToLogin = () => {
    const path = getRouteWithRole(routerApp.auth.signIn);
    router.replace(path);
  };

  const navigate = (url: string, params: Record<string, string> = {}, query: Record<string, string> = {}) => {
    const routerWithParams = Object.keys(params).reduce((acc, key) => {
      return acc.replace(`:${key}`, params[key]);
    }, url);

    const routerWithQuery = Object.keys(query).reduce((acc, key, index) => {
      return `${acc}${index === 0 ? "?" : "&"}${key}=${query[key]}`;
    }, routerWithParams);
    router.push(routerWithQuery);
  };

  const getRouteWithRole = (url: string, params: Record<string, string> = {}, query: Record<string, string> = {}) => {
    const pathRole = pathname.split('/')[1];
    if (pathRole && isValidRolePathName(pathRole)) {
      const routerWithParams = Object.keys(params).reduce((acc, key) => {
        return acc.replace(new RegExp(`:${key}`, 'g'), params[key]);
      }, url);

      const routerWithQuery = Object.keys(query).reduce((acc, key, index) => {
        return `${acc}${index === 0 ? '?' : '&'}${key}=${query[key]}`;
      }, routerWithParams);

      return `/${pathRole}${routerWithQuery}`;
    } else {
      return '/admin';
    }
  };

  const goBack = () => {
    router.back();
  };

  return {
    goToHome,
    goToLogin,
    navigate,
    goBack,
    getRouteWithRole
  };
};

export default useAppNavigation;


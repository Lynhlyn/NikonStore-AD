import { useParams, usePathname } from 'next/navigation';
import { IRouterItem } from '../types/item';

export const useCheckRouter = (_router?: IRouterItem) => {
  const pathname = usePathname();
  const params = useParams();

  const normalizePath = (path: string) => path.replace(/\/+$/, '');

  const isMatchPattern = (pattern: string, currentPath: string) => {
    const regexPattern = '^' + normalizePath(pattern).replace(/:[^/]+/g, '[^/]+') + '$';
    const regex = new RegExp(regexPattern);

    if (pattern.includes('/:id') && currentPath.includes('/register')) {
      return false;
    }

    return regex.test(normalizePath(currentPath));
  };

  const isActived = (item: IRouterItem): boolean => {
    const { route, subsRoute, routerActive = [], query = [] } = item;
    const currentPath = normalizePath(pathname);

    if (normalizePath(route ?? '') === currentPath) return true;

    if (routerActive.some((pattern) => isMatchPattern(pattern, currentPath))) {
      return true;
    }

    const routeWithParams = normalizePath(
      query.reduce(
        (acc, q) => acc.replace(`:${q}`, params[q]?.toString() ?? ''),
        route ?? ''
      )
    );
    if (routeWithParams === currentPath) return true;

    if (subsRoute?.length) {
      return subsRoute.some((subRoute) => isActived(subRoute));
    }

    return false;
  };

  return {
    isActived,
  };
};


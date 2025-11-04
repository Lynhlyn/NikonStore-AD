import { useCallback, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/hook/redux';
import { RootState } from '@/lib/services/store';
import { setIsOpenSidebar, toggleSidebar } from '@/lib/features/appSlice';

export const useSidebarControl = () => {
  const dispatch = useAppDispatch();
  const isOpenSidebar = useAppSelector<RootState, boolean>(
    (state) => state.app.isOpenSidebar
  );

  const openSidebar = useCallback(() => {
    dispatch(setIsOpenSidebar(true));
  }, [dispatch]);

  const closeSidebar = useCallback(() => {
    dispatch(setIsOpenSidebar(false));
  }, [dispatch]);

  const toggle = useCallback(() => {
    dispatch(toggleSidebar());
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && isOpenSidebar) {
        closeSidebar();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpenSidebar, closeSidebar]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
        event.preventDefault();
        toggle();
      }
      
      if (event.key === 'Escape' && window.innerWidth < 1024 && isOpenSidebar) {
        closeSidebar();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggle, closeSidebar, isOpenSidebar]);

  return {
    isOpenSidebar,
    openSidebar,
    closeSidebar,
    toggle,
  };
};


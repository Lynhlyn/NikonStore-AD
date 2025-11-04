import { useDispatch } from "react-redux";
import { setLogout } from "@/lib/features/authSlice";

export const useLogout = () => {
  const dispatch = useDispatch();
  const logout = () => {
    dispatch(setLogout());
  }
  return { logout };
};


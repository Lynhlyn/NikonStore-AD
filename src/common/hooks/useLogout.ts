import { useDispatch } from "react-redux";
import { setLogout } from "@/lib/features/authSlice";
import { clearUser } from "@/lib/features/userSlice";

export const useLogout = () => {
  const dispatch = useDispatch();
  const logout = () => {
    dispatch(setLogout());
    dispatch(clearUser());
  }
  return { logout };
};


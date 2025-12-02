import { useAppDispatch, useAppSelector } from './redux';
import { logInUser, logUpUser, logOutUser } from '@/slices/authSlice';
import { UserInterface } from '@/types/post.types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { personInfo, isAuth } = useAppSelector((state) => state.auth);

  const logIn = (email: string, password: string) => {
    return dispatch(logInUser({ email, password }));
  };

  const logUp = (email: string, password: string) => {
    return dispatch(logUpUser({ email, password }));
  };

  const logOut = () => {
    return dispatch(logOutUser());
  };

  return {
    personInfo: personInfo || ({} as UserInterface),
    isAuth,
    logIn,
    logUp,
    logOut,
  };
};

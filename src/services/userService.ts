import { User } from '@/types/user';

const USER_KEY = 'user_info';

export const saveUserInfo = (userInfo: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(userInfo));
};

export const getUserInfo = (): User | null => {
  const data = localStorage.getItem(USER_KEY);

  return data ? JSON.parse(data) : null;
};

export const clearUserInfo = () => {
  localStorage.removeItem(USER_KEY);
};

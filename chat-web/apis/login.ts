import { HttpOption, useHttp } from '~/composables/useHttp';

enum Api {
  login = '/auth/login',
  getUserInfo = '/user/getuserByUsername',
  register = '/auth/register',
}
export const login = async (
  params: { username: string; password: string },
  option?: HttpOption<any>,
) => {
  return await useHttp.post<any>(Api.login, JSON.stringify(params), option);
};

export const register = async (
  params: { username: string; password: string },
  option?: HttpOption<any>,
) => {
  return await useHttp.post<any>(Api.register, JSON.stringify(params), option);
};

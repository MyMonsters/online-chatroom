import { User } from 'types/type';
import { HttpOption, useHttp } from '~/composables/useHttp';

enum Api {
  getUserInfo = '/user/getuserByUsername',
  updateUserInfo = '/user/updateUser',
  uploadAvatar = '/user/uploadAvatar',
}

export const getUserInfo = async (
  params: { username: string },
  option?: HttpOption<any>,
) => {
  return await useHttp.get(Api.getUserInfo, params, option);
};
export const updateUserInfo = async (body: User, option?: HttpOption<any>) => {
  return await useHttp.post(Api.updateUserInfo, JSON.stringify(body), option);
};
export const uploadAvatar = async (
  body: FormData,
  option?: HttpOption<any>,
) => {
  return await useHttp.post(Api.uploadAvatar, body, option);
};

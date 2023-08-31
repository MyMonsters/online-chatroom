import apiFetch from '../request';
export default async function getUserInfo(params: { userId: number }) {
  // return 'ss';
  return apiFetch('/user/getfriendMessagesInfo', {
    method: 'get',
    params: params,
  });
}

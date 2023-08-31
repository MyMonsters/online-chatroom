import apiFetch from '../request';
export default defineEventHandler(async (event) => {
  const params = await getQuery(event);
  const token = getCookie(event, 'token') as string;
  return apiFetch('/friend/getfriendInfo', {
    method: 'get',
    query: params,
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
});

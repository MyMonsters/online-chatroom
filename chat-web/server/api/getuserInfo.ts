import apiFetch from '../request';
export default defineEventHandler(async (event) => {
  const params = await getQuery(event);
  const token = getCookie(event, 'token') as string;
  console.log('token', token);
  return apiFetch('/user/getuserByUsername', {
    method: 'get',
    query: params,
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
});

import apiFetch from '../request';
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const token = getCookie(event, 'token') as string;
  return apiFetch('/user/updateUser', {
    method: 'post',
    body: body,
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
});

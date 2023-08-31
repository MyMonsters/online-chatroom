import apiFetch from '../request';
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  return apiFetch('/auth/login', { body: body, method: 'post' });
});

import apiFetch from '../request';
export default async function login(params: {
  username: string;
  password: string;
}) {
  // return 'ss';
  return apiFetch('/auth/register', { method: 'post', body: params });
}

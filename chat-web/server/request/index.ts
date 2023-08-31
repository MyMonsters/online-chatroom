// import { useCookie } from 'nuxt/app';
import { ofetch } from 'ofetch';
// import { useUserStore } from '../../store/user';
// const token: string = useUserStore().token || '';
const apiFetch = ofetch.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    // Authorization: token,
  },
});
export default apiFetch;

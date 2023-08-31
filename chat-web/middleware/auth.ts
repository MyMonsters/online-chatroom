import { useUserStore } from '@/store/user';

export default defineNuxtRouteMiddleware((to: any, from: any) => {
  const token = useCookie('token').value;
  if (to.fullPath !== '/login') {
    if (!token) {
      return navigateTo('/login');
    }
  } else {
    if (token) {
      console.log('object');
      return navigateTo('/');
    }
  }
});

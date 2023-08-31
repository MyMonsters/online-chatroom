import { defineStore } from 'pinia';
import { User } from 'types/type';
import { useChatStore } from './chat';

export const useUserStore = defineStore(
  'indexState',
  {
    // state: () =>
    //   useSessionStorage('userStore', {
    //     token: '',
    //     userInfo: {} as User,
    //   }),
    state: () => ({
      userInfo: {} as any,
      friendInfo: {} as any,
    }),
    actions: {
      async handleLoginAction(username: string, password: string) {
        const Response = await fetch('/api/login', {
          method: 'post',
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        });
        const result = processReturn(await Response.json());
        const chatStore = useChatStore();
        this.setUserInfo(result.user);
        useCookie('token').value = result.token;
        chatStore.initSocket();
        // fetch(`/api/getfriendInfo?userId=${result.user.userId}`, {
        //   method: 'get',
        // }).then(async (res) => {
        //   const result = processReturn(await res.json());
        //   this.setFriendInfo(result);
        // });
        navigateTo('/');
      },
      setUserInfo(userInfo: any) {
        this.userInfo = userInfo;
      },
      setFriendInfo(friendInfo: any) {
        this.friendInfo = friendInfo;
      },
    },
    persist: true,
  },
  // { persist: true },
);

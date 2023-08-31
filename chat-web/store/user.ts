import { defineStore } from 'pinia';
import { User } from 'types/type';
import { useChatStore } from './chat';
import { Friend, FriendDataType, Message } from 'types/type';
import { Socket } from 'dgram';
import io from 'socket.io-client';

export const useUserStore = defineStore(
  'userState',
  {
    // state: () =>
    //   useSessionStorage('userStore', {
    //     token: '',
    //     userInfo: {} as User,
    //   }),
    state: () => ({
      userInfo: {} as any,
      friendInfo: {} as any,
      isLogin: false,
      getToken: '',
      socket: {} as any,
    }),
    actions: {
      async handleLoginAction(username: string, password: string) {
        const myres = await useApi().login.login({
          username: username,
          password: password,
        });
        const result = processReturn(myres.data.value);
        const chatStore = useChatStore();
        console.log(result);
        if (result) {
          this.setUserInfo(result.user);
          this.setIsLogin(true);
          this.getToken = result.token;
          useCookie('token').value = result.token;
          chatStore.initSocket();
          navigateTo('/');
        }
      },
      async handleRegisterAction(username: string, password: string) {
        const myres = await useApi().login.register({
          username: username,
          password: password,
        });
        const result = processReturn(myres.data.value);
        const chatStore = useChatStore();
        if (result) {
          this.setUserInfo(result.user);
          this.setIsLogin(true);
          this.getToken = result.token;
          useCookie('token').value = result.token;
          chatStore.initSocket();
          navigateTo('/');
        }
      },
      setUserInfo(userInfo: any) {
        this.userInfo = userInfo;
      },
      setFriendInfo(friendInfo: any) {
        this.friendInfo = friendInfo;
      },
      clearUserInfo() {
        this.userInfo = '';
      },
      setToken(token: string) {
        this.getToken = token;
      },
      setIsLogin(isLogin: boolean) {
        this.isLogin = isLogin;
      },
      setSocket(socket: any) {
        this.socket = socket;
      },
    },
    persist: {
      beforeRestore: (ctx) => {
        console.log('before', ctx.store);
        // const socket = ctx.store.socket;
        // const friendData = ctx.store.friendData;
        // const currentSession = ctx.store.currentSession;
        // ctx.store.setSocket(JSON.parse(JSON.stringify(socket)));
        // ctx.store.setFriendData(JSON.parse(JSON.stringify(friendData)));
        // ctx.store.setCurrentSession(JSON.parse(JSON.stringify(currentSession)));
      },
      afterRestore: (ctx) => {
        console.log('after', ctx.store.socket);
        // const socket = ctx.store.socket;
        // ctx.store.setSocket(JSON.stringify(socket));
        // const friendData = ctx.store.friendData;
        // const currentSession = ctx.store.currentSession;
        // ctx.store.setFriendData(JSON.stringify(friendData));
        // ctx.store.setCurrentSession(JSON.stringify(currentSession));
      },
    },
  },
  // { persist: true },
);

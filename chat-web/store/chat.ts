import { defineStore, skipHydrate } from 'pinia';
import { useUserStore } from './user';
import io from 'socket.io-client';
import { Friend, FriendDataType, Message } from 'types/type';

export const useChatStore = defineStore(
  'chatState',
  {
    state: () => ({
      // socket: {} as Socket,
      // currentSession: {} as FriendDataType,
      // // friendData: {} as Array<FriendDataType>,
      // friendData: [] as Array<FriendDataType>,
      socket: {} as any,
      currentSession: {} as FriendDataType,
      friendData: [] as Array<FriendDataType>,
    }),
    //

    actions: {
      setSocket(socket: any) {
        this.socket = socket;
      },
      setCurrentSession(currentSession: FriendDataType) {
        if (currentSession) {
          this.currentSession = currentSession;

          this.socket.emit('joinChat', {
            userId: useUserStore().userInfo.userId,
            friendId: currentSession.userId,
          });
        }
      },
      setFriendData(friendData: any) {
        this.friendData = friendData;
      },
      initSocket() {
        const toast = useToast();
        console.log('initSocket');
        const userStore = useUserStore();
        const userInfo = userStore.userInfo;
        // let socket: Socket = io('http://localhost:3000');
        let socket = io(`http://localhost:3000`, {
          query: { userId: userInfo.userId.toString() },
          withCredentials: true,
          reconnection: true,
        });
        socket.on('connect', () => {
          console.log(socket.connected); // true
          socket.emit('getInfodata', {
            userId: userInfo.userId,
          });

          this.setSocket(socket);
          console.log('socket', this.socket);
        });

        socket.on('addFriend', (data) => {
          console.log(data);

          if (!data.code) {
            toast.add({
              title: data.msg,
              icon: 'i-heroicons-check-circle',
            });
            socket.emit('getInfodata', {
              userId: userInfo.userId,
            });
          } else {
            toast.add({
              title: data.msg,
              icon: 'i-heroicons-exclamation-circle',
              color: 'red',
            });
          }
        });
        socket.on('getInfodata', (data) => {
          // const result = processReturn(data);
          // console.log(result);
          // if (result.msg) {
          //   toast.add({ title: result.msg });
          //   return;
          // }
          console.log(data);
          this.setFriendData(data.data.friendData);
          let currentSession: any = this.friendData.length
            ? this.friendData[0]
            : null;
          this.setCurrentSession(currentSession);
        });
        socket.on('removeFriend', (data) => {
          console.log(data);
          if (!data.code) {
            toast.add({
              title: data.msg,
              icon: 'i-heroicons-check-circle',
            });
            socket.emit('getInfodata', {
              userId: userInfo.userId,
            });
          } else {
            toast.add({
              title: data.msg,
              icon: 'i-heroicons-exclamation-circle',
              color: 'red',
            });
          }
        });
        socket.on('joinChat', (data) => {
          console.log(data);
        });
        socket.on('sendMessage', (data) => {
          console.log(data);
          const result = processReturn(data);
          let message = [...this.currentSession.messages, result];
          this.currentSession.messages = message;
        });
        // console.log(JSON.stringify(socket));
        // this.setSocket(JSON.stringify(socket));
      },
    },
    persist: [
      {
        paths: ['currentSession'],
        storage: persistedState.localStorage,
      },
      {
        paths: ['friendData'],
        storage: persistedState.localStorage,
      },
    ],
  },
  // {}
);

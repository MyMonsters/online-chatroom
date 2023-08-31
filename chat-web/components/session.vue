<template>
  <div class="flex-1 h-full mt-3 relative flex flex-col">
    <div
      class="border-solid flex justify-between border-2 border-l-0 border-b-0 pt-4 pl-6"
      v-if="currentSession"
    >
      {{ currentSession.nickname }}
    </div>
    <div
      class="border-solid border-2 border-l-0 border-t-0 pl-2 h-5/6 overflow-y-scroll scroll-ml-6"
      ref="sessionRef"
    >
      <template v-for="(item, index) in currentSession.messages">
        <div
          class="friendMessage items-center flex h-fit"
          v-if="item.userId == currentSession.userId"
        >
          <span class="w-10"
            ><img
              class="rounded-full"
              src="https://th.bing.com/th/id/OIP.7EPZ1Sq8SkPMH1B7xuIg5wAAAA?w=213&h=213&c=7&r=0&o=5&dpr=1.3&pid=1.7"
          /></span>

          <span class="m-4 bg-neutral-200 w-fit p-2">{{ item.content }}</span>
        </div>
        <div
          class="friendMessage flex-row-reverse mr-4 items-center flex h-fit"
          v-else
        >
          <span class="w-10"
            ><img
              class="rounded-full"
              src="https://th.bing.com/th/id/OIP.7EPZ1Sq8SkPMH1B7xuIg5wAAAA?w=213&h=213&c=7&r=0&o=5&dpr=1.3&pid=1.7"
          /></span>

          <span class="m-4 bg-lime-100 w-fit p-2">{{ item.content }}</span>
        </div>
      </template>

      <!-- <div class="friendMessage items-center flex h-fit">
        <span class="w-10"
          ><img
            class="rounded-full"
            src="https://th.bing.com/th/id/OIP.7EPZ1Sq8SkPMH1B7xuIg5wAAAA?w=213&h=213&c=7&r=0&o=5&dpr=1.3&pid=1.7"
        /></span>

        <span class="m-4 bg-neutral-200 w-fit p-2">在吗</span>
      </div> -->
    </div>
    <div
      class="bg-parent w-full p-3 h-24 flex flex-1 items-center border-solid border-b-2 border-r-2"
    >
      <!-- <input class="w-full h-full bg-parent mb-2" /> -->
      <div class="flex-1">
        <UTextarea color="green" variant="outline" v-model="content" />
      </div>

      <!-- <button
        class="h-6 bg-cyan-200 py-1 px-2 text-xs rounded text-neutral-600 ml-auto w-10"
      >
        发送
      </button> -->
      <div class="flex justify-end h-fit">
        <UButton
          color="gray"
          class="py-1 my-2"
          variant="soft"
          size="sm"
          icon="i-heroicons-paper-airplane-solid"
          @click="handleSendMessage"
          >发送</UButton
        >
      </div>
    </div>
    <div></div>
  </div>
</template>

<script setup lang="ts">
import { Socket } from 'socket.io-client';
import { useUserStore } from '~/store/user';
import { useChatStore } from '~/store/chat';
import { Message } from '~/types/type';
const chatStore = useChatStore();
const userStore = useUserStore();
const userInfo = userStore.userInfo;
const content = ref('');
const sessionRef: any = ref();
let currentSession = computed(() => chatStore.currentSession);
if (sessionRef.value) {
  console.log(sessionRef.value.scrollTop);
  sessionRef.value.scrollTop = sessionRef.value.scrollHeight;
}

onUpdated(() => {
  sessionRef.value.scrollTop = sessionRef.value.scrollHeight;
});

// watch(
//   () => currentSession.value.messages,
//   (newVal, oldVal) => {
//     sessionRef.value.scrollTop = sessionRef.value.scrollHeight;
//   },
// );
// watchEffect((currentSession) => {
//   console.log(sessionRef.value.scrollTop, sessionRef.value.scrollHeight);
//   sessionRef.value.scrollTop = sessionRef.value.scrollHeight;
// });

const handleSendMessage = () => {
  let socket = ref(chatStore.socket);
  let message: Message = {
    userId: userStore.userInfo.userId,
    friendId: currentSession.value.userId,
    content: content.value,
    time: 0,
  };

  socket.value.emit('sendMessage', message);
  content.value = '';
};
</script>

<style scoped></style>

<template>
  <div class="home w-3/5 h-4/5 rounded-md shadow-md">
    <div
      class="w-full p-4 h-full rounded-md shadow-md bg-green-100/50 flex flex-col"
    >
      <User />
      <div class="flex h-5/6">
        <Chatbar />
        <Session />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import User from '~/components/user.vue';
import Chatbar from '~/components/chatbar.vue';
import Session from '~/components/session.vue';

import { useChatStore } from '~/store/chat';

definePageMeta({
  middleware: 'auth',
});
const chatStore = useChatStore();
const token = useCookie('token');
onMounted(() => {
  if (token.value) {
    chatStore.initSocket();
  }
});
</script>

<style scoped>
.home {
  background-image: url('@/assets/bg.jpg');
}
</style>

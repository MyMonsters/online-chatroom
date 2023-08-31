<template>
  <div class="w-48 h-full mt-3">
    <div class="sessionlist border-solid border-2 rounded h-full">
      <template v-for="(item, index) in friendData" :key="item.userId">
        <div
          class="flex items-center border-solid border-b-2 sessionitem h-14 p-2 hover:bg-neutral-400/50"
          @click="(e) => handleChangeCurrentSession(item.userId)"
          @contextmenu.prevent="onContextMenu"
          :style="{
            backgroundColor:
              item.userId == currentSession.userId ? '#a9adbc66' : '',
          }"
        >
          <!-- <template> -->
          <UContextMenu v-model="isOpen" :virtual-element="virtualElement">
            <!-- Content -->
            <span
              class="p-4 py-4 cursor-pointer hover:bg-gray-300 text-red-400"
              @click="() => handleRemoveFriend(item.userId)"
              >删除好友</span
            >
          </UContextMenu>
          <div class="w-10">
            <img :src="item.avatar" />
          </div>
          <div class="ml-3 flex flex-col justify-evenly">
            <div>
              {{ item.nickname }}
            </div>
            <div class="text-xs text-neutral-600">
              {{ item.messages[item.messages.length - 1]?.content }}
            </div>
          </div>
          <!-- </template> -->
        </div>
      </template>

      <!-- <div
        class="flex items-center border-solid border-b-2 sessionitem h-14 p-2"
      >
        <div class="w-10">
          <img
            src="https://th.bing.com/th/id/OIP.7EPZ1Sq8SkPMH1B7xuIg5wAAAA?w=213&h=213&c=7&r=0&o=5&dpr=1.3&pid=1.7"
          />
        </div>
        <div class="ml-3 flex flex-col justify-around">
          <div>Aruato</div>
          <div class="text-xs text-gray-900">你好呀</div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/store/user';
import { useChatStore } from '~/store/chat';
import { FriendDataType } from '~/types/type';
const chatStore = useChatStore();
const userStore = useUserStore();
const userInfo = userStore.userInfo;
const friendData: ComputedRef<Array<FriendDataType>> = computed(
  () => chatStore.friendData,
);
const currentSession = computed(() => chatStore.currentSession);
const handleChangeCurrentSession = (userId: number) => {
  const currentSession = friendData.value.filter((item) => {
    return item.userId === userId;
  });
  chatStore.setCurrentSession(currentSession[0]);
};
const { x, y } = useMouse();
const { y: windowY } = useWindowScroll();

const isOpen = ref(false);
const virtualElement = ref({ getBoundingClientRect: () => ({}) });

function onContextMenu() {
  const top = unref(y) - unref(windowY);
  const left = unref(x);

  virtualElement.value.getBoundingClientRect = () => ({
    width: 0,
    height: 0,
    top,
    left,
  });

  isOpen.value = true;
}
const handleRemoveFriend = (friendId: number) => {
  let socket = ref(chatStore.socket);
  socket.value.emit('removeFriend', {
    userId: userInfo.userId,
    friendId: friendId,
  });
};
</script>

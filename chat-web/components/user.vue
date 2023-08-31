<template>
  <div class="w-full h-16 flex relative">
    <UAvatar
      chip-color="primary"
      chip-text=""
      chip-position="top-right"
      size="lg"
      :src="userInfo.avatar"
    />
    <div class="flex flex-col justify-around ml-5">
      <div class="font-mono text-lg">
        {{ userInfo.nickname
        }}<span class="text-xs ml-5 h-fit inline-block"
          ><UButton color="white" variant="solid" @click="isEditOpen = true"
            >编辑资料</UButton
          ></span
        >
        <UModal v-model="isEditOpen" prevent-close>
          <UCard
            :ui="{
              ring: '',
              divide: 'divide-y divide-gray-100 dark:divide-gray-800',
            }"
          >
            <template #header>
              <div class="flex items-center justify-between">
                <h3
                  class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
                >
                  编辑资料
                </h3>
                <UButton
                  color="gray"
                  variant="ghost"
                  icon="i-heroicons-x-mark-20-solid"
                  class="-my-1"
                  @click="handleEditClose"
                />
              </div>
            </template>
            <UForm
              ref="form"
              :validate="validate"
              :state="state"
              @submit.prevent="submit"
            >
              <form @submit.prevent="handleImageUpload">
                <UAvatar
                  chip-color="primary"
                  chip-text=""
                  chip-position="top-right"
                  size="lg"
                  :src="userInfo.avatar"
                />
                <span
                  ><input type="file" @change="handleFile($event)" style="" />
                </span>

                <input type="submit" />
              </form>
              <UFormGroup label="Nickname" name="nickname">
                <UInput v-model="state.nickname" />
              </UFormGroup>
              <UFormGroup label="Desc" name="desc">
                <UInput v-model="state.desc" />
              </UFormGroup>
              <UFormGroup label="Password" name="password">
                <div class="flex">
                  <div class="flex-1">
                    <UInput
                      v-model="state.password"
                      :disabled="isEditPassword"
                      type="password"
                    />
                  </div>

                  <span
                    class="ml-4 text-sky-400 cursor-pointer"
                    @click="handleResetPassword"
                    >重置</span
                  >
                </div>
              </UFormGroup>

              <UButton type="submit" class="mt-4"> 保存 </UButton>
            </UForm>
          </UCard>
        </UModal>
      </div>
      <div class="italic">{{ userInfo.desc }}</div>
    </div>
    <div
      class="absolute right-0 top-0 cursor-pointer"
      @click="
        () => {
          isLogoutOpen = true;
        }
      "
    >
      <UTooltip text="退出">
        <UIcon name="i-heroicons-power" />
      </UTooltip>
      <UModal v-model="isLogoutOpen" prevent-close>
        <UCard
          :ui="{
            ring: '',
            divide: 'divide-y divide-gray-100 dark:divide-gray-800',
          }"
        >
          <div class="justify-center text-lg flex items-center">
            <UIcon
              name="i-heroicons-exclamation-circle "
              class="mr-4"
            />确认退出？
          </div>
          <div class="mt-6 flex justify-end gap-x-5">
            <UButton @click="isLogoutOpen = false">取消</UButton>
            <UButton @click="handleLogout">确认</UButton>
          </div>
        </UCard>
      </UModal>
    </div>

    <div class="py-4 absolute top-4 right-0">
      <UButton
        icon="i-heroicons-plus-circle-20-solid "
        color="white"
        variant="solid"
        @click="isOpen = true"
        >添加好友</UButton
      >
    </div>
    <UModal v-model="isOpen" prevent-close>
      <UCard
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
            >
              添加好友
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="isOpen = false"
            />
          </div>
        </template>
        <div class="h-32">
          <div class="flex">
            <div class="flex-1">
              <UInput
                icon="i-heroicons-magnifying-glass-20-solid"
                color="white"
                :trailing="false"
                placeholder="请输入用户名"
                v-model="searchUsername"
              />
            </div>

            <UButton color="gray" variant="ghost" @click="handleSearchUser"
              >查找</UButton
            >
          </div>
          <div class="flex mt-6 relative items-center" v-if="searchResult">
            <div class="mr-6">
              <UAvatar size="xl" :src="searchResult.avatar" />
            </div>
            <div class="flex flex-col justify-evenly">
              <div>{{ searchResult.nickname }}</div>
              <div class="text-xs text-gray-500">{{ searchResult.desc }}</div>
            </div>
            <UButton
              class="absolute right-3"
              icon="i-heroicons-plus-circle"
              variant="ghost"
              @click="handleAddFriend"
            />
          </div>
          <div
            v-else-if="searchResult === 0"
            class="justify-center m-5 flex items-center"
          >
            <UIcon name="i-heroicons-exclamation-circle" class="h-5 w-5" />
            该用户不存在!
          </div>
        </div>

        <!-- <Placeholder class="h-32" /> -->
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
interface User {
  userId: number;
  nickname: string;
  username: string;
  password: string;
  desc: string;
  avatar: string;
  status: string;
  createtime: Date;
}

import { useUserStore } from '@/store/user';
import { useChatStore } from '@/store/chat';
import type { FormError } from '@nuxthq/ui/dist/runtime/types';
const toast = useToast();

const userStore = useUserStore();
const chatStore = useChatStore();
const userInfo: Ref<User> = computed(() => userStore.userInfo);

const searchResult: any = ref(undefined);
// useNuxtApp().$socket.emit('joinRoom', userInfo.userId.toString());
const isOpen = ref(false);
const isEditOpen = ref(false);
const isLogoutOpen = ref(false);
const searchUsername = ref('');
const isEditPassword = ref(true);
const state = ref({
  nickname: userInfo.value.nickname,
  desc: userInfo.value.desc,
  password: userInfo.value.password,
  avatar: userInfo.value.avatar,
  status: userInfo.value.status,
});
const handleAddFriend = async () => {
  let socket: any = chatStore.socket;
  console.log(socket);
  socket.emit('addFriend', {
    userId: userInfo.value.userId,
    friendId: searchResult.value.userId,
  });
};
const handleLogout = () => {
  const token = useCookie('token');
  token.value = '';
  navigateTo('/login');
};
const handleSearchUser = async () => {
  // const Response = await fetch('/api/login', {
  //     method: 'post',
  //     body: JSON.stringify({
  //       username: username.value,
  //       password: password.value,
  //     }),
  //   });
  //   const result = processReturn(await Response.json());
  const userInfoRes = await useApi().user.getUserInfo({
    username: searchUsername.value,
  });
  const result = userInfoRes.data.value?.data;
  console.log(result);
  // fetch(`/api/getuserInfo?username=${searchUsername.value}`, {
  //   method: 'get',
  // }).then(async (res) => {
  //   const result = processReturn(await res.json());

  //   searchResult.value = result || 0;
  // });
  searchResult.value = result || 0;
};

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.nickname) errors.push({ path: 'nickname', message: 'Required' });
  if (!state.password) errors.push({ path: 'password', message: 'Required' });
  if (!state.desc) errors.push({ path: 'desc', message: 'Required' });
  return errors;
};

const form = ref();
const avatarFile = ref();
async function submit() {
  await form.value!.validate();
  const updateResponse = await useApi().user.updateUserInfo(state.value);
  const result = updateResponse.data.value;
  const data = processReturn(result);
  if (data) userStore.setUserInfo(data);
}
const handleResetPassword = () => {
  state.value.password = '';
  isEditPassword.value = false;
};
const handleEditClose = () => {
  isEditOpen.value = false;
  state.value = {
    nickname: userInfo.value.nickname,
    desc: userInfo.value.desc,
    password: userInfo.value.password,
    avatar: userInfo.value.avatar,
    status: userInfo.value.status,
  };
};
async function handleImageUpload() {
  try {
    const fd = new FormData();
    fd.append('avatar', avatarFile.value);
    console.log(userInfo.value);
    fd.append('userId', userInfo.value.userId.toString());
    const uploadResponse = await useApi().user.uploadAvatar(fd);
    const result = uploadResponse.data.value;
    // console.log(result.data.value?.data);
    // const result = await $fetch('/api/upload', {
    //   method: 'POST',
    //   body: fd,
    // });
    // const result = processReturn(await Response.json());
    const data = processReturn(result);
    if (data) userStore.setUserInfo(data);
  } catch (error) {
    console.log(error);
  }
}

function handleFile(e) {
  console.log(e.target.files);
  avatarFile.value = e.target.files[0];
}
</script>

<style scoped></style>

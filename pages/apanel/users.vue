<script setup lang="ts">
import ConfirmationModal from '~/components/modals/ConfirmationModal.vue';
import type { UserDto } from '~/types/adminUserDto';
import { Role } from '~/types/Role.enum';
import type { UpdateUserDto } from '~/types/updateUserDto';

definePageMeta({
  layout: 'admin-layout',
  middleware: ['auth'],
  role: [Role.ADMIN]
});

const showModal = ref(false);
const users = ref<UserDto[]>()
const editingUser = ref<{ username: string, name: string, role: Role}>({ username: '', name: '', role: Role.USER });
const editingUserId = ref<number>(-1);
const userToDelete = ref<number>(-1);

const roleClass = (role: Role) => {
  switch (role) {
    case 'USER':
      return 'text-blue-600 dark:text-blue-400';
    case 'USER_ORG':
      return 'text-green-600 dark:text-green-400';
    case 'ADMIN':
      return 'text-purple-700 dark:text-pink-500';
    default:
      return 'text-neutral-600 dark:text-neutral-300';
  }
};

onMounted(async () => {
    users.value = await useUserApi().getAll();
})

const initEditUser = (user: UserDto) => {
    editingUserId.value = user.id;
    editingUser.value = {
        username: user.username || '',
        name: user.name || user.firstName + (user.lastName ? ` ${user.lastName}` : ''),
        role: user.role
    };
}

const calcelEdit = () => {
  editingUserId.value = -1;
  editingUser.value = { username: '', name: '', role: Role.USER };
}

const updateUser = async () => {
    let userBefore = users.value?.find((user) => user.id === editingUserId.value);
    if (userBefore && !userBefore?.name) {
        userBefore.name = userBefore.firstName + (userBefore.lastName ? ` ${userBefore.lastName}` : '');
    }

    const data = Object.fromEntries(
      Object.entries(editingUser.value)
        .filter(([k, v]) => (userBefore as any)[k] !== v)
    ) as Partial<UpdateUserDto>

    if (Object.keys(data).length === 0) {
      return
    }

    await useUserApi().updateUserById(editingUserId.value.toString(), data);
    calcelEdit()
    users.value = await useUserApi().getAll();
}

const deleteUser = async () => {
    await useUserApi().deleteUserById(userToDelete.value);
    users.value = await useUserApi().getAll();
    showModal.value = false;
}

</script>

<template>
    <ConfirmationModal
      v-model="showModal"
      title="Вы уверены, что хотите удалить пользователя?"
      @onConfirm="deleteUser"
    />

    <div class="p-4 min-h-screen">
        <div class="overflow-x-auto shadow-xs rounded-lg">
            <table class="min-w-[1020px] lg:min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
              <thead class="bg-neutral-50 dark:bg-neutral-700">
                <tr>
                  <th class="px-4 py-2 text-left text-sm font-medium text-neutral-700 dark:text-neutral-200">ID</th>
                  <th class="px-4 py-2 text-left text-sm font-medium text-neutral-700 dark:text-neutral-200">Пользователь</th>
                  <th class="px-4 py-2 text-left text-sm font-medium text-neutral-700 dark:text-neutral-200">Юзернейм в Telegram</th>
                  <th class="px-4 py-2 text-left text-sm font-medium text-neutral-700 dark:text-neutral-200">Роль</th>
                  <th class="px-4 py-2 text-left text-sm font-medium text-neutral-700 dark:text-neutral-200">Последний вход</th>
                  <th class="px-4 py-2 text-left text-sm font-medium text-neutral-700 dark:text-neutral-200">Дата создания</th>
                  <th class="px-4 py-2 text-left text-sm font-medium text-neutral-700 dark:text-neutral-200">Действия</th>
                </tr>
              </thead>
              <TransitionGroup tag="tbody" name="table" class="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
                <template v-for="user in users" :key="user.id">
                    <tr class="hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      <td class="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-300">{{ user.id }}</td>
                      <td class="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-300 flex items-center">
                        <img
                          v-if="user.photoUrl"
                          :src="user.photoUrl"
                          alt="Avatar"
                          class="h-8 w-8 rounded-full mr-2"
                        />
                        <span>{{ user.name || user.firstName + (user.lastName ? ` ${user.lastName}` : '') }}</span>
                      </td>
                      <td class="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-300">{{ user.username ? `@${user.username}` : '-' }}</td>
                      <td class="px-4 py-2 text-sm">
                        <span :class="roleClass(user.role)">{{ user.role }}</span>
                      </td>
                      <td class="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-300">{{ user.lastAuth }}</td>
                      <td class="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-300">{{ user.createdAt }}</td>
                      <td class="flex gap-2 px-4 py-2 text-sm text-neutral-600 dark:text-neutral-300">
                        <a v-if="user.username" class="rounded-full h-8 w-8 flex items-center justify-center text-white bg-blue-500 hover:bg-blue-600 hover:cursor-pointer" :href="`tg://resolve?domain=${user.username}`"><Icon name="bi:telegram" size="16" /></a>
                        <div v-else class="rounded-full h-8 w-8 flex items-center justify-center text-white/50 bg-blue-500/50 hover:bg-blue-600/50 hover:cursor-not-allowed"><Icon name="bi:telegram" size="16" /></div>
                        <button class="rounded-full h-8 w-8 flex items-center justify-center text-white bg-green-700 hover:bg-green-800" @click.stop.prevent="() => initEditUser(user)"><Icon name="bi:pencil-fill" size="16" /></button>
                        <button class="rounded-full h-8 w-8 flex items-center justify-center text-white bg-red-700 hover:bg-red-800" @click.stop.prevent="() => { userToDelete = user.id; showModal = true; }"><Icon name="bi:trash2-fill" size="16" /></button>
                      </td>
                    </tr>
                    <tr v-if="editingUserId === user.id" class="hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      <td class="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-300">{{ user.id }}</td>
                      <td class="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-300 flex items-center">
                        <img
                          v-if="user.photoUrl"
                          :src="user.photoUrl"
                          alt="Avatar"
                          class="h-8 w-8 rounded-full mr-2"
                        />
                        <input type="text" v-model="editingUser.name" class="py-1.5 sm:py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-gray-500 focus:ring-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="Имя пользователя">
                      </td>
                      <td class="flex-row px-4 py-2 text-sm text-neutral-600 dark:text-neutral-300">
                        <div class="flex items-center gap-1">
                            @<input type="text" v-model="editingUser.username" class="py-1.5 sm:py-2 px-3 block border-gray-200 rounded-lg text-sm focus:border-gray-500 focus:ring-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="Юзернейм в Telegram">
                        </div>
                      </td>
                      <td class="px-4 py-2 text-sm">
                        <select
                          v-model="editingUser.role"
                          class="py-1.5 sm:py-2 px-3 block border border-gray-200 rounded-lg text-sm focus:border-gray-500 focus:ring focus:ring-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        >
                          <option
                            v-for="r in Object.values(Role)"
                            :key="r"
                            :value="r"
                          >
                            {{ r }}
                          </option>
                        </select>
                      </td>
                      <td class="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-300">{{ user.lastAuth }}</td>
                      <td class="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-300">{{ user.createdAt }}</td>
                      <td class="flex ml-2 gap-2 px-4 py-2 text-sm text-neutral-600 dark:text-neutral-300">
                        <button class="rounded-full h-8 w-8 flex items-center justify-center text-white bg-emerald-600 hover:bg-emerald-700" @click.stop.prevent="updateUser"><Icon name="bi:check" size="28" /></button>
                        <button class="rounded-full h-8 w-8 flex items-center justify-center text-white bg-red-700 hover:bg-red-800" @click.stop.prevent="calcelEdit"><Icon name="bi:x" size="28" /></button>
                      </td>
                    </tr>
                </template>
              </TransitionGroup>
            </table>
        </div>
    </div>

    <div>
        modal
    </div>
</template>

<style scoped>
.table-enter-active,
.table-leave-active {
  transition: all 0.3s ease;
}
.table-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.table-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
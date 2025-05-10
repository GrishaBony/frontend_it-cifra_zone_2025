<script setup lang="ts">

const userStore = useUserStore();
const user = computed(() => userStore.user)

// for SSR
const profile = ref({
  photo: '',
  user: '',
  username: ''
})

onMounted(() => {
  const currentUser = user.value
  if (currentUser) {
    profile.value = {
      photo: currentUser.photo || currentUser.photoUrl || '',
      user: currentUser.name || currentUser.firstName + (currentUser?.lastName ? ` ${currentUser?.lastName}` : ''),
      username: currentUser?.username || ''
    }
  }
})

const Chats = [
    {id: 'UUID_V4_DKOD09_9d3009dk3_9d309d3_9303d9k', title: 'Чат намбе ван'},
    {id: 'UUID_V4_DKOD09_9d3009dk3_9d309d3_9303d9k', title: 'Чат c веточкой', childBranches: [
        {id: 'UUID_V4_DKOD09_9d3009dk3_9d309d3_9303d9k', title: 'Чатоветка #1'},
        {id: 'UUID_V4_DKOD09_9d3009dk3_9d309d3_9303d9k', title: 'Чатоветка #2'},
    ]}
]

const closeSidebar = () => {
  if (window.innerWidth < 1024) {
    const sidebar = document.querySelector('#hs-application-sidebar')
    if (sidebar && window.HSOverlay) {
      // @ts-ignore
      window.HSOverlay.close(sidebar)
    }
  }
}

</script>

<template>
    <div class="bg-gray-50 transition-all duration-300 lg:hs-overlay-layout-open:ps-65 dark:bg-neutral-900">
        <!-- ========== MAIN CONTENT ========== -->
        <main id="content">
          <!-- Breadcrumb -->
          <div class="sticky top-0 inset-x-0 z-20 bg-transparentpx-4 px-2">
            <div class="flex items-center py-2">
              <!-- Navigation Toggle -->
              <button type="button" class="size-8 flex justify-center items-center gap-x-2 border border-gray-200 text-gray-800 hover:text-gray-500 rounded-lg focus:outline-hidden focus:text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-200 dark:hover:text-neutral-500 dark:focus:text-neutral-500" aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-application-sidebar" aria-label="Toggle navigation" data-hs-overlay="#hs-application-sidebar">
                <span class="sr-only">Toggle Navigation</span>
                <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/><path d="m8 9 3 3-3 3"/></svg>
              </button>
              <!-- End Navigation Toggle -->
            </div>
          </div>
          <!-- End Breadcrumb -->
      
          <!-- Sidebar -->
          <div id="hs-application-sidebar" class="hs-overlay [--body-scroll:true] lg:[--overlay-backdrop:false] [--is-layout-affect:true] [--auto-close:lg]
            hs-overlay-open:translate-x-0
            -translate-x-full transition-all duration-300 transform
            w-65 h-full
            hidden
            fixed inset-y-0 start-0 z-60
            bg-white border-e border-gray-200
      
            dark:bg-neutral-800 dark:border-neutral-700" role="dialog" tabindex="-1" aria-label="Sidebar">
            <div class="relative flex flex-col h-full max-h-full">
              <div class="px-6 pt-4 flex items-center">
                <!-- Logo -->
                <SidebarLogo class="h-12" />
                <!-- End Logo -->
            
                <!-- <div class="hidden lg:block ms-2"> -->
                
                <!-- </div> -->
              </div>
          
              <!-- Content -->
              <div class="flex flex-col justify-between h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
                <nav class="hs-accordion-group p-3 w-full flex flex-col flex-wrap" data-hs-accordion-always-open>
                  <ul class="flex flex-col space-y-1">
                    <SidebarItem to="/" :is-loading="false">Заголовок чата</SidebarItem>
                    <SidebarItem to="/newchat" :is-loading="false">Заголовок чата</SidebarItem>

                    <SidebarDropdownItem>
                      <template #title>
                        <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        Users
                      </template>
                      <SidebarDropdownItem>
                        <template #title>
                          Sub Menu 1
                        </template>
                        <SidebarItem to="/">Link 1</SidebarItem>
                        <SidebarItem to="/">Link 2</SidebarItem>
                        <SidebarItem to="/">Link 3</SidebarItem>
                      </SidebarDropdownItem>
                      <SidebarDropdownItem>
                        <template #title>
                          Sub Menu 2
                        </template>
                        <SidebarItem to="/">Link 1</SidebarItem>
                        <SidebarItem to="/">Link 2</SidebarItem>
                        <SidebarItem to="/">Link 3</SidebarItem>
                      </SidebarDropdownItem>
                    </SidebarDropdownItem>
                
                    <SidebarDropdownItem>
                      <template #title>
                        <svg class="shrink-0 mt-0.5 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="15" r="3"/><circle cx="9" cy="7" r="4"/><path d="M10 15H6a4 4 0 0 0-4 4v2"/><path d="m21.7 16.4-.9-.3"/><path d="m15.2 13.9-.9-.3"/><path d="m16.6 18.7.3-.9"/><path d="m19.1 12.2.3-.9"/><path d="m19.6 18.7-.4-1"/><path d="m16.8 12.3-.4-1"/><path d="m14.3 16.6 1-.4"/><path d="m20.7 13.8 1-.4"/></svg>
                        Account
                      </template>
                      <SidebarItem to="/">Link 1</SidebarItem>
                      <SidebarItem to="/">Link 2</SidebarItem>
                      <SidebarItem to="/">Link 3</SidebarItem>
                    </SidebarDropdownItem>

                    <SidebarDropdownItem>
                      <template #title>
                        <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                        Projects
                      </template>
                      <SidebarItem to="/">Link 1</SidebarItem>
                      <SidebarItem to="/">Link 2</SidebarItem>
                      <SidebarItem to="/">Link 3</SidebarItem>
                    </SidebarDropdownItem>
                
                    <SidebarItem to="/">
                      <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
                      Calendar
                    </SidebarItem>
                    <SidebarItem to="/">
                      <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                      Documentation
                    </SidebarItem>
                  </ul>
                </nav>
                <NuxtLink to="/profile" @click="closeSidebar">
                  <div class="flex p-3 hover:bg-black/10 rounded-t-2xl items-center gap-2">
                      <NuxtImg v-if="profile.photo" class="inline-block size-8 rounded-full border-2 border-gray-800 dark:border-gray-200" :src="profile.photo" />
                      <div class="flex flex-col text-sm text-gray-800 dark:text-gray-200">
                        <div><p>{{ profile.user }}</p></div>
                        <div class="text-xs text-gray-600 dark:text-gray-400"><p>{{ profile.username }}</p></div>
                      </div>
                  </div>
                </NuxtLink>
              </div>
              <!-- End Content -->
            </div>
          </div>
          <!-- End Sidebar -->
      
          <!-- Content -->
          <div class="w-full">
            <slot />
          </div>
          <!-- End Content -->
        </main>
        <!-- ========== END MAIN CONTENT ========== -->
    </div>
</template>

<style scoped>

</style>
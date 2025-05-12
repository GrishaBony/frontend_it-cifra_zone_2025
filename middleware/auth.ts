import type { Role } from "~/types/Role.enum";

export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return;

  const authStore = useAuthStore()
  const userStore = useUserStore()

  const user = await useAuthApi().getMe()

  if (!user) {
    authStore.isLoggedIn = false; 
    userStore.user = null;
    throw createError({
      statusCode: 401,
    })
  } else {
    userStore.user = user
  }

  // Получить разрешённые роли из мета
  const requiredRoles = to.meta.role as Role | Role[] | undefined

  if (requiredRoles) {
    const allowedRoles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]
    if (!allowedRoles.includes(user.role)) {
        throw createError({ statusCode: 404 })
    }
  }
})

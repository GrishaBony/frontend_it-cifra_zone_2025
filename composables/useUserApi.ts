// import type { UserDto } from '~/types/UserDto'

// export function useUserApi() {
//   const { $api } = useNuxtApp()

//   const getUser = async (id: string): Promise<UserDto> => {
//     const { data } = await $api.get<UserDto>(`/users/${id}`)
//     return data
//   }

// //   const updateUser = async (id: string, body: Partial<UserDto>) => {
// //     const { data } = await $api.put<UserDto>(`/users/${id}`, body)
// //     return data
// //   }

//   return { getUser }
// }

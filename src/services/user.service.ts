import { api, ContentType, type ChangePassword } from '.'

export interface userProfileUpdateInput {
  first_name?: string
  last_name?: string
  bio?: string
  profile_picture?: File | null
  phone_number?: string
  address?: string
}

export interface userListQuery {
  email?: string
  is_active?: string
  search?: string
  ordering?: string
  limit?: number
  offset?: number
}

export const getUserProfile = async () => {
  try {
    const response = await api.users.usersProfileRead()

    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const updateProfile = async (profileData: userProfileUpdateInput) => {
  try {
    const response = await api.users.usersProfilePartialUpdate(profileData)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const changePassword = async (changePassData: ChangePassword) => {
  try {
    const response = await api.users.usersPasswordChangeUpdate(changePassData, {
      headers: {
        'Content-Type': ContentType.Json
      }
    })
    return response.data
  } catch (err: any) {
    console.error(err)
    throw err.error
  }
}

export const getUserList = async (query?: userListQuery) => {
  try {
    const response = await api.users.usersList(query)
    return response.data
  } catch (error) {
    console.error('Failed to fetch users:', error)
    throw error
  }
}

export const getUserById = async (userId: number) => {
  try {
    const response = await api.users.usersRead(userId)
    return response.data
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const blockUser = async (userId: number | undefined) => {
  if (!userId) return
  try {
    const response = await api.users.usersPartialUpdate(
      userId,
      {
        action: 'block'
      },
      {
        headers: { 'Content-Type': ContentType.Json }
      }
    )
    return response.data
  } catch (err) {
    console.error(err)
    throw err
  }
}

import { api, ContentType } from '.'

import type { Login, Register } from './api'

export const login = async (loginData: Login) => {
  try {
    const response = await api.auth.authLoginCreate(loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return response.data
  } catch (error) {
    console.error('Login error:', error)
    throw new Error('Login failed. Please check your credentials.')
  }
}

export const logout = async () => {
  try {
    await api.auth.authLogoutCreate()
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  } catch (err) {
    throw new Error('Logout failed...')
  }
}

export const signup = async (registerData: Register) => {
  try {
    const response = await api.auth.authRegisterCreate(registerData, {
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

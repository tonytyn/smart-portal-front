import request from '@/config/axios'
import type { User } from './types'

export const getUserListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/user/list', params })
}
export const createUserApi = (data: Partial<User>): Promise<IResponse> => {
  return request.post({ url: '/user/create', data })
}
export const deleteUserApi = (params: any): Promise<IResponse> => {
  return request.delete({ url: '/user/delete', params })
}
export const updateUserApi = (data: Partial<User>): Promise<IResponse> => {
  return request.delete({ url: '/user/update', data })
}

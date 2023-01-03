import request from '@/config/axios'
import type { User } from './types'

export const getUserListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/user/list', params })
}
export const createUserApi = (data: Partial<User>): Promise<IResponse> => {
  return request.post({ url: '/user/create', data })
}
export const deleteUserApi = (userIds: string[]): Promise<IResponse> => {
  return request.delete({ url: '/user/delete', data: { userIds } })
}
export const updateUserApi = (data: Partial<User>): Promise<IResponse> => {
  return request.put({ url: '/user/update', data })
}

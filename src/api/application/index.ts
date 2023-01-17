import request from '@/config/axios'
import type { Application } from './types'

export const getAppListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/app/list', params })
}
export const createAppApi = (data: Partial<Application>): Promise<IResponse> => {
  return request.post({ url: '/app/create', data })
}
export const deleteAppApi = (userIds: string[]): Promise<IResponse> => {
  return request.delete({ url: '/app/delete', data: { userIds } })
}
export const updateAppApi = (data: Partial<Application>): Promise<IResponse> => {
  return request.put({ url: '/app/update', data })
}

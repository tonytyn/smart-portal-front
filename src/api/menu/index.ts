import request from '@/config/axios'
import type { Menu } from './types'

export const searchMenuTreeApi = (): Promise<IResponse> => {
  return request.get({ url: '/menu/tree' })
}
export const createMenuApi = (data: Menu): Promise<IResponse> => {
  return request.post({ url: '/menu/create', data })
}
export const deleteMenuApi = (meunId: string): Promise<IResponse> => {
  return request.delete({ url: '/menu/delete', params: meunId })
}

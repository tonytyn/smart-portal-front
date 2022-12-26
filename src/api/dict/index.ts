import request from '@/config/axios'
// import type { User } from './types'

export const searchDictTreeApi = (partntId: number): Promise<IResponse> => {
  return request.get({ url: '/dict/tree', params: partntId })
}

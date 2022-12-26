import request from '@/config/axios'
// import type { User } from './types'

export const searchOrgTreeApi = (): Promise<IResponse> => {
  return request.get({ url: '/org/tree' })
}

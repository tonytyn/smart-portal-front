import request from '@/config/axios'
import type { Role, RoleMenu, UserRole } from './types'

export const getRoleListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/role/list', params })
}

export const getRoleByIdApi = (id: string): Promise<IResponse> => {
  return request.get({ url: '/role/detail', params: { id } })
}

export const createRoleApi = (data: Role): Promise<IResponse> => {
  return request.post({ url: '/role/create', data })
}
export const deleteRoleApi = (id: string): Promise<IResponse> => {
  return request.delete({ url: '/role/delete', params: { id } })
}

export const getBoundedMenuApi = (roleId: string): Promise<IResponse> => {
  return request.get({ url: '/role/bounded-menus', params: { roleId } })
}
export const bindMenuApi = (data: RoleMenu[]): Promise<IResponse> => {
  return request.post({ url: '/role/bind-menus', data })
}
export const getUserListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/role/users', params })
}
export const bindUserApi = (userRole: UserRole): Promise<IResponse> => {
  return request.post({ url: '/role/bind-users', data: userRole })
}
export const unBindUserApi = (userRole: UserRole): Promise<IResponse> => {
  return request.delete({ url: '/role/unbind-users', data: userRole })
}

export type Role = {
  id: string
  roleName: string
  createUserAccount: string
  createUsername: string
  createTime: string
}
export type RoleMenu = {
  roleId: string
  menuId: string
  whetherAll: boolean
}
export type UserRole = {
  userId: string
  roleId: string
}

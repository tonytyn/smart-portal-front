export type Menu = {
  id: string
  parentId: string
  menuCode: string
  menuName: string
  menuType: string
  children: Menu[] | null
}

import { config } from '@/config/axios/config'
import { MockMethod } from 'vite-plugin-mock'

const { result_code } = config

const timeout = 1000
type Menu = {
  id: string
  parentId: string
  menuCode: string
  menuName: string
  menuType: string
  disabled?: boolean
  children: Menu[] | null
}

const menuTree: Menu[] = [
  {
    id: '11',
    parentId: '0',
    menuCode: 'index',
    menuName: '首页',
    menuType: 'page',
    children: [
      {
        id: '111',
        parentId: '11',
        menuCode: 'desc',
        menuName: '系统介绍',
        menuType: 'button',
        disabled: true,
        children: []
      }
    ]
  },
  {
    id: '22',
    parentId: '0',
    menuCode: 'app-list',
    menuName: '应用列表',
    menuType: 'page',
    children: [
      {
        id: '221',
        parentId: '22',
        menuCode: 'list',
        menuName: '应用列表',
        menuType: 'page',
        children: []
      }
    ]
  },
  {
    id: '33',
    parentId: '0',
    menuCode: 'manging',
    menuName: '应用管理',
    menuType: 'page',
    children: [
      {
        id: '331',
        parentId: '33',
        menuCode: 'manging-app',
        menuName: '应用管理',
        menuType: 'page',
        children: []
      }
    ]
  },
  {
    id: '44',
    parentId: '0',
    menuCode: 'system',
    menuName: '系统管理',
    menuType: 'page',
    children: [
      {
        id: '441',
        parentId: '44',
        menuCode: 'user',
        menuName: '用户管理',
        menuType: 'page',
        children: []
      },
      {
        id: '442',
        parentId: '44',
        menuCode: 'role',
        menuName: '角色管理',
        menuType: 'page',
        children: []
      },
      {
        id: '443',
        parentId: '44',
        menuCode: 'meun',
        menuName: '菜单管理',
        menuType: 'page',
        children: []
      }
    ]
  }
]
export default [
  // 菜单树接口
  {
    url: '/menu/tree',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: result_code,
        msg: '查询成功！',
        data: { tree: menuTree }
      }
    }
  },
  {
    url: '/menu/create',
    method: 'post',
    timeout,
    response: () => {
      return {
        code: result_code,
        msg: '演示模式，请勿当真'
      }
    }
  },
  {
    url: '/menu/delete',
    method: 'delete',
    timeout,
    response: () => {
      return {
        code: result_code,
        msg: '演示模式，请勿当真'
      }
    }
  }
] as MockMethod[]

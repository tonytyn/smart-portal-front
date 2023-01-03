import { config } from '@/config/axios/config'
import { MockMethod } from 'vite-plugin-mock'

const { result_code } = config

const timeout = 1000

const List: {
  id: number
  username: string
  account: string
  phoneNumber: string
  email: string
  roles?: number[]
  state: string
  permissions: string | string[]
}[] = [
  {
    id: 1,
    username: '管理员',
    account: 'admin',
    phoneNumber: '13828856999',
    email: '123@ccc.com',
    roles: [1],
    state: 'enable',
    permissions: ['*.*.*']
  },
  {
    id: 2,
    username: '测试账号',
    account: 'test',
    phoneNumber: '13828856563',
    email: '345@ddd.com',
    state: 'disable',
    permissions: ['example:dialog:create', 'example:dialog:delete']
  },
  {
    id: 3,
    username: '张三',
    account: 'zhangsan',
    phoneNumber: '13628856563',
    email: '345@ddd.com',
    roles: [2, 3],
    state: 'enable',
    permissions: ['example:dialog:create', 'example:dialog:delete']
  },
  {
    id: 4,
    username: '李四',
    account: 'lisia',
    phoneNumber: '13528856563',
    email: '345@ddd.com',
    state: 'enable',
    permissions: ['example:dialog:create', 'example:dialog:delete']
  },
  {
    id: 5,
    username: '王五',
    account: 'wangwu',
    phoneNumber: '13228856543',
    email: '345@ddd.com',
    state: 'enable',
    permissions: ['example:dialog:create', 'example:dialog:delete']
  }
]

export default [
  // 列表接口
  {
    url: '/user/list',
    method: 'get',
    response: ({ query }) => {
      const { username, pageIndex, pageSize } = query

      const mockList = List.filter((item) => {
        if (username && item.username.indexOf(username) < 0) return false
        return true
      })
      const pageList = mockList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )

      return {
        code: result_code,
        data: {
          total: mockList.length,
          list: pageList
        }
      }
    }
  },
  {
    url: '/user/create',
    method: 'post',
    response: () => {
      return {
        code: result_code,
        msg: '演示模式，请勿当真'
      }
    }
  },
  {
    url: '/user/update',
    method: 'put',
    response: () => {
      return {
        code: result_code,
        msg: '演示模式，请勿当真'
      }
    }
  },
  {
    url: '/user/delete',
    method: 'delete',
    response: () => {
      return {
        code: result_code,
        msg: '演示模式，请勿当真'
      }
    }
  },
  // 登录接口
  {
    url: '/user/login',
    method: 'post',
    timeout,
    response: ({ body }) => {
      const data = body
      let hasUser = false
      for (const user of List) {
        if (user.account === data.username) {
          hasUser = true
          return {
            code: result_code,
            data: user
          }
        }
      }
      if (!hasUser) {
        return {
          code: '500',
          message: '账号或密码错误'
        }
      }
    }
  },
  // 退出接口
  {
    url: '/user/loginOut',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: result_code,
        data: null
      }
    }
  }
] as MockMethod[]

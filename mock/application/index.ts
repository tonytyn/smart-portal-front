import { config } from '@/config/axios/config'
import { MockMethod } from 'vite-plugin-mock'

const { result_code } = config

const timeout = 1000

const List: {
  id: string
  appName: string
  publicKey: string
  secretKey: string
  profile: string
  applyWay: string
  state: string
  createUser: string
  admins: string
  createTime: string
  contactWay: string
}[] = [
  {
    id: '111',
    appName: '考勤系统',
    publicKey: '7abj897dc099a',
    secretKey: '7abj897dc099a',
    profile: '考勤查询、补签、加班、请假、调休等业务',
    applyWay: 'self自助申请',
    state: '开发中',
    createUser: '张三先生',
    admins: '张三,李四,王五',
    createTime: '2022-02-02',
    contactWay: '钉钉搜索张三先生'
  },
  {
    id: '222',
    appName: '设备点检系统',
    publicKey: '7abj897dc099a',
    secretKey: '7abj897dc099a',
    profile: '对现场设备进行定期点检',
    applyWay: 'invite管理员邀请',
    state: '已上线',
    createUser: '李四',
    admins: '张三,李四,王五',
    createTime: '2022-02-02',
    contactWay: '电话15888884388'
  },
  {
    id: '333',
    appName: '体检预约系统',
    publicKey: '7abj897dc099a',
    secretKey: '7abj897dc099a',
    profile: '预约每年一次的员工体检',
    applyWay: 'free无需申请',
    state: '已下线',
    createUser: '王五',
    admins: '张三,李四,王五',
    createTime: '2022-02-02',
    contactWay: '钉钉搜索张三先生'
  }
]

export default [
  // 列表接口
  {
    url: '/app/list',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { appName, pageIndex, pageSize } = query

      const mockList = List.filter((item) => {
        if (appName && item.appName.indexOf(appName) < 0) return false
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
    url: '/app/create',
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
    url: '/app/update',
    method: 'put',
    timeout,
    response: () => {
      return {
        code: result_code,
        msg: '演示模式，请勿当真'
      }
    }
  },
  {
    url: '/app/delete',
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

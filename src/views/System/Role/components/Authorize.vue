<script setup lang="ts">
import { ElButton, ElTag, ElRow, ElCol, ElDivider, ElMessage } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { useI18n } from '@/hooks/web/useI18n'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { getUserListApi } from '@/api/user'
import { getAuthorizedUserApi, bindUserApi, unBindUserApi } from '@/api/role'
import { User } from '@/api/user/types'
// import { Role } from '@/api/role/types'
import { ref, reactive } from 'vue'

const { t } = useI18n()
//初始化用户列表
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'username',
    label: t('user.username'),
    search: {
      show: true
    },
    form: {
      show: false
    },
    detail: {
      show: false
    }
  },
  {
    field: 'account',
    label: t('user.account'),
    search: {
      show: true
    },
    form: {
      show: false
    },
    detail: {
      show: false
    }
  },

  {
    field: 'action',
    width: '260px',
    label: t('tableDemo.action'),

    form: {
      show: false
    },
    detail: {
      show: false
    }
  }
])
// 表头和内容对其方式
const alignType = ref('center')
const { register, tableObject, methods } = useTable<User>({
  getListApi: getUserListApi,
  response: {
    list: 'list',
    total: 'total'
  }
})

const { allSchemas } = useCrudSchemas(crudSchemas)
const { getList, setSearchParams } = methods
getList()

// 初始化已授权
const props = defineProps({
  currentRole: {
    type: Object,
    default: () => null
  }
})
const authorized = reactive({ users: [] as Array<User> })
const loading = ref(false)
async function searchAuthorizedUser(roleId: string) {
  loading.value = true
  const res = await getAuthorizedUserApi(roleId)
  loading.value = false
  if (res.code) {
    authorized.users = res.data
  }
}
searchAuthorizedUser(props.currentRole.id)

const bindLoading = ref(false)

const handleAuthorize = async (row: User) => {
  bindLoading.value = true
  const res = await bindUserApi({ userId: row.id, roleId: props.currentRole.id }).finally(() => {
    bindLoading.value = false
  })
  if (res.code) {
    ElMessage.success('操作成功！')
  }
}
// 处理解绑事件
async function handleUnBind(userId: string) {
  const res = await unBindUserApi({ userId: userId, roleId: props.currentRole.id })
  if (res.code) {
    ElMessage.success('操作成功！')
    searchAuthorizedUser(props.currentRole.id)
  }
}
</script>

<template>
  <ContentWrap :title="t('role.authorized')">
    <el-row v-loading="loading">
      <el-col>
        <el-tag
          v-for="user in authorized.users"
          :key="user.id"
          size="large"
          closable
          class="ml-2"
          @close="handleUnBind(user.id)"
        >
          {{ user.username }}({{ user.account }})
        </el-tag>
      </el-col>
    </el-row>
    <el-divider />
    <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams" />
    <Table
      :align="alignType"
      :header-align="alignType"
      v-model:pageSize="tableObject.pageSize"
      v-model:pageIndex="tableObject.pageIndex"
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :pagination="{
        total: tableObject.total
      }"
      @register="register"
    >
      <template #action="{ row }">
        <ElButton
          type="danger"
          v-hasPermi="['example:dialog:delete']"
          @click="handleAuthorize(row)"
        >
          {{ t('role.bindRole') }}
        </ElButton>
      </template>
    </Table>
  </ContentWrap>
</template>

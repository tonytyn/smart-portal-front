<script setup lang="ts">
import { h, ref, reactive, PropType } from 'vue'
import { ElButton, ElMessage, ElTag } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { useI18n } from '@/hooks/web/useI18n'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import { getUserListApi, bindUserApi, unBindUserApi } from '@/api/role'
import { User } from '@/api/user/types'
import { Role } from '@/api/role/types'

const { t } = useI18n()
// 定义需要传递过来的参数
const props = defineProps({
  currentRole: {
    type: Object as PropType<Nullable<Role>>,
    default: () => null
  }
})
//定义展示需要的字段
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
    field: 'authorizeState',
    label: t('role.authorizeState'),
    formatter: (_: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElTag,
        {
          type: cellValue === 'authorized' ? 'success' : 'danger'
        },
        () => (cellValue === 'authorized' ? t('role.authorized') : t('role.unauthorized'))
      )
    },
    search: {
      show: true,
      value: 'authorized',
      component: 'Select',
      componentProps: {
        options: [
          {
            label: t('role.authorized'),
            value: 'authorized'
          },
          {
            label: t('role.unauthorized'),
            value: 'unauthorized'
          }
        ]
      }
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
    label: t('common.operation'),
    form: {
      show: false
    },
    detail: {
      show: false
    }
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)
// 表头和内容对其方式
const alignType = ref('center')

const { register, tableObject, methods } = useTable<User>({
  getListApi: getUserListApi,
  response: {
    list: 'list',
    total: 'total'
  }
})

const { setSearchParams } = methods
// 默认查询已授权用户列表
setSearchParams({ roleId: props.currentRole?.id, authorizeState: 'authorized' })

// 授权
const handleBindUser = async (userId: string) => {
  const res = await bindUserApi({ userId: userId, roleId: props.currentRole!.id })
  if (res.code) {
    ElMessage.warning(res.msg)
  }
}
// 取消授权
const handleUnBindUser = async (userId: string) => {
  const res = await unBindUserApi({ userId: userId, roleId: props.currentRole!.id })
  if (res.code) {
    ElMessage.warning(res.msg)
    // setSearchParams({ roleId: props.currentRole?.id, authorizeState: 'authorized' })
  }
}
</script>

<template>
  <ContentWrap :title="t('role.currentRole') + ':' + currentRole!.roleName">
    <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams" />
    <Table
      :align="alignType"
      :header-align="alignType"
      :selection="false"
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
          v-if="row.authorizeState === 'unauthorized'"
          type="primary"
          @click="handleBindUser(row.id)"
        >
          {{ t('role.bindUser') }}
        </ElButton>
        <ElButton v-else type="danger" @click="handleUnBindUser(row.id)">
          {{ t('role.unbindUser') }}
        </ElButton>
      </template>
    </Table>
  </ContentWrap>
</template>

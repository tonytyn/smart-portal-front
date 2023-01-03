<script setup lang="ts">
import { h, ref, unref, reactive } from 'vue'
import { ElButton, ElTag, ElMessage } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Dialog } from '@/components/Dialog'
import { Table } from '@/components/Table'
import { useI18n } from '@/hooks/web/useI18n'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import Create from './components/Create.vue'
import Detail from './components/Detail.vue'
import { getUserListApi, createUserApi, deleteUserApi, updateUserApi } from '@/api/user'
import { getRoleListApi } from '@/api/role'
import { User } from '@/api/user/types'

const { t } = useI18n()

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    label: t('tableDemo.index'),
    type: 'index',
    form: {
      show: false
    },
    detail: {
      show: false
    }
  },
  {
    field: 'username',
    label: t('user.username'),
    search: {
      show: true
    }
  },
  {
    field: 'account',
    label: t('user.account')
  },
  {
    field: 'phoneNumber',
    label: t('user.phoneNumber')
  },
  {
    field: 'email',
    label: t('user.email')
  },
  {
    field: 'roles',
    label: t('user.roles'),
    table: {
      show: false
    },
    form: {
      value: [3], // 默认值
      colProps: {
        span: 24
      },
      component: 'Select',
      componentProps: {
        style: {
          width: '100%'
        },
        multiple: true,
        valueKey: 'id',
        optionsAlias: {
          labelField: 'roleName',
          valueField: 'id'
        }
      },
      api: async () => {
        return (await getRoleListApi(null)).data.list
      }
    },
    detail: {
      span: 24
    }
  },

  {
    field: 'state',
    label: t('user.state'),
    formatter: (_: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElTag,
        {
          type: cellValue === 'enable' ? 'success' : 'danger'
        },
        () => (cellValue === 'enable' ? t('common.enable') : t('common.disable'))
      )
    },
    form: {
      component: 'Switch',
      componentProps: {
        activeText: '启用',
        inactiveText: '停用',
        activeValue: 'enable',
        inactiveValue: 'disable',
        inlinePrompt: true
      }
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

const { allSchemas } = useCrudSchemas(crudSchemas)
const { register, tableObject, methods } = useTable<User>({
  getListApi: getUserListApi,
  delListApi: deleteUserApi,
  response: {
    list: 'list',
    total: 'total'
  }
})

const { getList, setSearchParams } = methods

getList()

const dialogVisible = ref(false)

const dialogType = ref('')

const dialogTitle = ref('')

const openDialog = (type: string, row: User | null) => {
  dialogType.value = type
  dialogTitle.value = t(
    type === 'create' ? 'common.create' : type === 'update' ? 'common.update' : 'common.detail'
  )
  tableObject.currentRow = row
  dialogVisible.value = true
}

const createRef = ref<ComponentRef<typeof Create>>()

const createLoading = ref(false)

const handleCreate = async () => {
  const create = unref(createRef)
  await create?.elFormRef?.validate(async (isValid) => {
    if (isValid) {
      createLoading.value = true
      const data = (await create?.getFormData()) as User
      let res: void | IResponse<any>
      if (dialogType.value === 'create') {
        res = await createUserApi(data)
          .catch(() => {})
          .finally(() => {
            createLoading.value = false
          })
      } else {
        res = await updateUserApi(data)
          .catch(() => {})
          .finally(() => {
            createLoading.value = false
          })
      }
      if (res) {
        ElMessage.warning(res.msg)
        dialogVisible.value = false
        tableObject.pageIndex = 1
        getList()
      }
    }
  })
}

const delLoading = ref(false)

const delData = async (row: User) => {
  tableObject.currentRow = row
  const { delList } = methods
  delLoading.value = true
  await delList([row.id], false).finally(() => {
    delLoading.value = false
  })
}
</script>

<template>
  <ContentWrap>
    <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams" />

    <div class="mb-10px">
      <ElButton type="primary" @click="openDialog('create', { state: 'enable' } as User)">
        {{ t('common.create') }}
      </ElButton>
    </div>

    <Table
      v-model:pageIndex="tableObject.pageIndex"
      v-model:pageSize="tableObject.pageSize"
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :selection="false"
      :loading="tableObject.loading"
      :pagination="{
        total: tableObject.total
      }"
      @register="register"
    >
      <template #action="{ row }">
        <ElButton
          type="primary"
          v-hasPermi="['example:dialog:edit']"
          @click="openDialog('update', row)"
        >
          {{ t('common.update') }}
        </ElButton>
        <ElButton
          type="success"
          v-hasPermi="['example:dialog:view']"
          @click="openDialog('detail', row)"
        >
          {{ t('exampleDemo.detail') }}
        </ElButton>
        <ElButton type="danger" :loading="delLoading" @click="delData(row)">
          {{ t('exampleDemo.del') }}
        </ElButton>
      </template>
    </Table>
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Create
      v-if="dialogType === 'create' || dialogType === 'update'"
      ref="createRef"
      :form-schema="allSchemas.formSchema"
      :current-row="tableObject.currentRow"
    />

    <Detail
      v-if="dialogType === 'detail'"
      :detail-schema="allSchemas.detailSchema"
      :current-row="tableObject.currentRow"
    />

    <template #footer>
      <ElButton
        v-if="dialogType !== 'detail'"
        type="primary"
        :loading="createLoading"
        @click="handleCreate"
      >
        {{ t('common.submit') }}
      </ElButton>
      <ElButton @click="dialogVisible = false">{{
        t(dialogType === 'detail' ? 'common.close' : 'common.cancel')
      }}</ElButton>
    </template>
  </Dialog>
</template>

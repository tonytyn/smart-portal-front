<script setup lang="ts">
import { ref, unref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Dialog } from '@/components/Dialog'
import { Table } from '@/components/Table'
import { useI18n } from '@/hooks/web/useI18n'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
// import { TableColumn } from '@/types/table'
import Create from './components/Create.vue'
import Detail from './components/Detail.vue'
import { getAppListApi, createAppApi, deleteAppApi, updateAppApi } from '@/api/application'
import { Application } from '@/api/application/types'

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
    field: 'appName',
    label: t('application.appName'),
    search: {
      show: true
    }
  },
  {
    field: 'publicKey',
    label: t('application.publicKey'),
    table: {
      show: false
    },
    form: {
      show: false
    }
  },
  {
    field: 'secretKey',
    label: t('application.secretKey'),
    table: {
      show: false
    },
    form: {
      show: false
    }
  },
  {
    field: 'profile',
    label: t('application.profile'),
    table: {
      show: false
    }
  },
  {
    field: 'applyWay',
    label: t('application.applyWay')
  },
  {
    field: 'state',
    label: t('application.state')
  },
  {
    field: 'createUser',
    label: t('application.createUser'),
    form: {
      show: false
    }
  },
  // {
  //   field: 'admins',
  //   label: t('application.admins')
  // },
  {
    field: 'createTime',
    label: t('application.createTime')
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
const { register, tableObject, methods } = useTable<Application>({
  getListApi: getAppListApi,
  delListApi: deleteAppApi,
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

const openDialog = (type: string, row: Application | null) => {
  dialogType.value = type
  dialogTitle.value = t(
    type === 'create' ? 'common.create' : type === 'update' ? 'common.update' : 'common.detail'
  )
  tableObject.currentRow = row as Application
  dialogVisible.value = true
}

const createRef = ref<ComponentRef<typeof Create>>()

const createLoading = ref(false)

const handleCreate = async () => {
  const create = unref(createRef)
  await create?.elFormRef?.validate(async (isValid) => {
    if (isValid) {
      createLoading.value = true
      const data = (await create?.getFormData()) as Application
      let res: void | IResponse<any>
      if (dialogType.value === 'create') {
        res = await createAppApi(data)
          .catch(() => {})
          .finally(() => {
            createLoading.value = false
          })
      } else {
        res = await updateAppApi(data)
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

const delData = async (row: Application) => {
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
      <ElButton type="primary" @click="openDialog('create', { state: 'enable' } as Application)">
        {{ t('common.create') }}
      </ElButton>
    </div>

    <Table
      v-model:pageIndex="tableObject.pageIndex"
      v-model:pageSize="tableObject.pageSize"
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :selection="false"
      :border="true"
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
      :currentRow="tableObject.currentRow"
    />

    <Detail
      v-if="dialogType === 'detail'"
      :detail-schema="allSchemas.detailSchema"
      :currentRow="tableObject.currentRow"
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

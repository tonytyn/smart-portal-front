<script setup lang="ts">
import { ref, unref, reactive, h } from 'vue'
import { ContentWrap } from '@/components/ContentWrap'
import { Dialog } from '@/components/Dialog'
import { Table } from '@/components/Table'
import { ElButton, ElMessage, ElTag } from 'element-plus'
import Create from './components/Create.vue'
import { searchMenuTreeApi, createMenuApi, deleteMenuApi } from '@/api/menu'
import { Menu } from '@/api/menu/types'
import { useI18n } from '@/hooks/web/useI18n'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { TableColumn } from '@/types/table'

const { t } = useI18n()
const getMenuTree = async () => {
  const res = await searchMenuTreeApi()
  return res.data.tree
}

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'parentId',
    label: t('menu.parentId'),
    table: {
      show: false
    },
    form: {
      colProps: {
        span: 24
      },
      component: 'Cascader',
      componentProps: {
        style: {
          width: '100%'
        },
        props: {
          value: 'id',
          label: 'menuName',
          checkStrictly: true
        }
      },
      api: getMenuTree
    }
  },
  {
    field: 'menuName',
    label: t('menu.menuName'),
    form: {
      colProps: {
        span: 24
      }
    }
  },
  {
    field: 'menuCode',
    label: t('menu.menuCode'),
    form: {
      colProps: {
        span: 24
      }
    }
  },
  {
    field: 'menuType',
    label: t('menu.menuType'),
    formatter: (_: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElTag,
        {
          type: cellValue === 'page' ? 'success' : 'danger',
          round: true
        },
        () => (cellValue === 'page' ? t('menu.page') : t('menu.button'))
      )
    },
    form: {
      colProps: {
        span: 24
      },
      component: 'Select',
      componentProps: {
        style: {
          width: '100%'
        },
        options: [
          {
            label: t('menu.page'),
            value: 'page'
          },
          {
            label: t('menu.button'),
            value: 'button'
          }
        ]
      }
    }
  },
  {
    field: 'action',
    width: '100px',
    label: t('tableDemo.action'),
    form: {
      show: false
    }
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)
const { register, tableObject, methods } = useTable<Menu>({
  getListApi: searchMenuTreeApi,
  delListApi: deleteMenuApi,
  response: {
    list: 'tree'
  }
})
const { getList } = methods
getList()
// 创建菜单对话框
const dialogVisible = ref(false)
const openCreateDialog = () => {
  dialogVisible.value = true
}
// 执行创建菜单
const createLoading = ref(false)
const createRef = ref<ComponentRef<typeof Create>>()
const createMenu = async () => {
  const create = unref(createRef)
  await create?.elFormRef?.validate(async (isValid) => {
    if (isValid) {
      createLoading.value = true
      const data = (await create?.getFormData()) as Menu
      data.parentId = data.parentId[0]
      const res = await createMenuApi(data)
        .catch(() => {})
        .finally(() => {
          createLoading.value = false
        })
      if (res?.code) {
        dialogVisible.value = false
        getList()
        ElMessage.success(res.msg)
      }
    }
  })
}
const delLoading = ref(false)
const deleteMenu = async (row: Menu) => {
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
    <div class="mb-10px">
      <ElButton type="primary" @click="openCreateDialog()">{{ t('common.create') }}</ElButton>
    </div>
    <Table
      row-key="id"
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :selection="false"
      @register="register"
    >
      <template #action="{ row }">
        <ElButton type="danger" size="small" :loading="delLoading" @click="deleteMenu(row)">
          {{ t('exampleDemo.del') }}
        </ElButton>
      </template>
    </Table>
  </ContentWrap>
  <Dialog v-model="dialogVisible" :title="t('menu.create')">
    <Create ref="createRef" :formSchema="allSchemas.formSchema" />
    <template #footer>
      <ElButton type="primary" :loading="createLoading" @click="createMenu">
        {{ t('common.submit') }}
      </ElButton>
      <ElButton @click="dialogVisible = false">{{ t('common.cancel') }}</ElButton>
    </template>
  </Dialog>
</template>

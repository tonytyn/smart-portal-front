<script setup lang="ts">
import { h, ref, unref, reactive } from 'vue'
import { ElTag, ElButton, ElMessage } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import { Dialog } from '@/components/Dialog'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
import { bindMenuApi, createRoleApi, deleteRoleApi, getRoleListApi } from '@/api/role'
import { useTable } from '@/hooks/web/useTable'
import { Role, RoleMenu } from '@/api/role/types'
import Create from './components/Create.vue'
import BindMenu from './components/BindMenu.vue'
import Authorize from './components/Authorize.vue'
import { TableColumn } from '@/types/table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'

const { t } = useI18n()

// 字段设置
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
    field: 'roleName',
    label: t('role.roleName'),
    form: {
      colProps: {
        span: 24
      }
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
      show: false
    }
  },
  {
    field: 'createTime',
    label: t('common.createTime'),
    fit: true,
    form: {
      show: false
    }
  },

  {
    field: 'action',
    width: '300px',
    label: t('tableDemo.action'),
    form: {
      show: false
    },
    detail: {
      show: false
    }
  }
])
// 使用hook处理字段
const { allSchemas } = useCrudSchemas(crudSchemas)

// 处理table
const { register, tableObject, methods } = useTable<Role>({
  getListApi: getRoleListApi,
  response: {
    list: 'list',
    total: 'total'
  }
})
const { getList } = methods

getList()

// 对话框属性控制
const dialogVisible = ref(false) //对话框开关
const dialogType = ref('') // 对话框类型
const dialogTitle = ref('') // 对话框标题
const dialogWidth = ref('') // 对话框宽度
const dialogHeight = ref('') // 对话框高度

const openCreateDialog = () => {
  dialogType.value = 'create'
  dialogTitle.value = t('role.create')
  dialogHeight.value = '100px'
  dialogWidth.value = '38%'
  dialogVisible.value = true
}

// 执行创建
const createRef = ref<ComponentRef<typeof Create>>()

const createLoading = ref(false)

const save = async () => {
  const create = unref(createRef)
  await create?.elFormRef?.validate(async (isValid) => {
    if (isValid) {
      createLoading.value = true
      const data = (await create?.getFormData()) as Role
      const res = await createRoleApi(data)
        .catch(() => {})
        .finally(() => {
          createLoading.value = false
        })
      if (res) {
        dialogVisible.value = false
        tableObject.pageIndex = 1
        getList()
        ElMessage.warning(res.msg)
      }
    }
  })
}

// 执行删除
const delLoading = ref(false)

const delData = async (row: Role) => {
  tableObject.currentRow = row
  delLoading.value = true
  const res = await deleteRoleApi(row.id).finally(() => {
    delLoading.value = false
  })
  if (res.code) {
    ElMessage.warning(res.msg)
  }
  getList()
}

// 打开绑定菜单对话框
const openBindMenuDialog = (row: Role) => {
  tableObject.currentRow = row
  dialogTitle.value = t('role.bindMenu') //这里注意，需要跟国际化配置关联
  dialogType.value = 'bindMenu'
  dialogHeight.value = '500px'
  dialogWidth.value = '32%'
  dialogVisible.value = true
}

// 执行更新菜单
const menuTreeRef = ref()
const bindMenuLoading = ref(false)
const updateMenus = async () => {
  bindMenuLoading.value = true
  const menuTree = unref(menuTreeRef)
  const checkedKeys: string[] = menuTree.getCheckedKeys()
  const halfCheckedKeys: string[] = menuTree.getHalfCheckedKeys()

  let roleMenus: RoleMenu[] = []
  checkedKeys.forEach((menuId) => {
    roleMenus.push({
      roleId: tableObject.currentRow?.id as string,
      menuId: menuId,
      whetherAll: true
    })
  })
  halfCheckedKeys.forEach((menuId) => {
    roleMenus.push({
      roleId: tableObject.currentRow?.id as string,
      menuId: menuId,
      whetherAll: false
    })
  })
  const res = await bindMenuApi(roleMenus)
    .catch((err) => err)
    .finally(() => {
      bindMenuLoading.value = false
    })

  if (res.code) {
    ElMessage.warning(res.msg)
  }
  dialogVisible.value = false
}
// 打开授权管理对话框
const openAuthorizeDialog = (row: Role) => {
  tableObject.currentRow = row
  dialogTitle.value = t('role.authorize') //这里注意，需要跟国际化配置关联
  dialogType.value = 'authorize'
  dialogHeight.value = '500px'
  dialogWidth.value = '68%'
  dialogVisible.value = true
}
// 关闭对话框
const handleDialogClose = () => {
  dialogType.value = ''
  dialogVisible.value = false
}
</script>

<template>
  <ContentWrap>
    <div class="mb-10px">
      <ElButton type="primary" @click="openCreateDialog()">{{ t('common.create') }}</ElButton>
    </div>

    <Table
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
        <ElButton type="primary" @click="openBindMenuDialog(row)">
          {{ t('role.bindMenu') }}
        </ElButton>
        <ElButton type="primary" @click="openAuthorizeDialog(row)">
          {{ t('role.authorize') }}
        </ElButton>
        <ElButton type="danger" v-hasPermi="['example:dialog:delete']" @click="delData(row)">
          {{ t('exampleDemo.del') }}
        </ElButton>
      </template>
    </Table>
  </ContentWrap>

  <Dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :maxHeight="dialogHeight"
    :width="dialogWidth"
  >
    <Create v-if="dialogType === 'create'" ref="createRef" :form-schema="allSchemas.formSchema" />
    <BindMenu
      v-if="dialogType === 'bindMenu'"
      ref="menuTreeRef"
      :role-id="tableObject.currentRow?.id"
    />
    <Authorize v-if="dialogType === 'authorize'" :currentRole="tableObject.currentRow" />
    <template #footer>
      <ElButton
        v-if="dialogType === 'create'"
        type="primary"
        :loading="createLoading"
        @click="save"
      >
        {{ t('common.submit') }}
      </ElButton>
      <ElButton
        v-if="dialogType === 'bindMenu'"
        type="primary"
        :loading="bindMenuLoading"
        @click="updateMenus"
      >
        {{ t('common.ok') }}
      </ElButton>
      <ElButton @click="handleDialogClose">{{ t('common.close') }}</ElButton>
    </template>
  </Dialog>
</template>

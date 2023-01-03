<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Dialog } from '@/components/Dialog'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
import { createRoleApi, deleteRoleApi, getRoleListApi, bindMenuApi } from '@/api/role'
import { useTable } from '@/hooks/web/useTable'
import { Role, RoleMenu } from '@/api/role/types'
import { Menu } from '@/api/menu/types'
import { ref, unref, reactive } from 'vue'
import Create from './components/Create.vue'
import BindMenu from './components/BindMenu.vue'
import Authorize from './components/Authorize.vue'

import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
// import { TableColumn } from '@/types/table'
const { t } = useI18n()

// 字段设置
const crudSchemas = reactive<CrudSchema[]>([
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
    field: 'createUserAccount',
    label: t('common.createUserAccount'),
    form: {
      show: false
    }
  },
  {
    field: 'createUsername',
    label: t('common.createUsername'),
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
console.log(tableObject.params)

getList()

// 执行删除
const delLoading = ref(false)

const delData = async (row: Role) => {
  tableObject.currentRow = row
  delLoading.value = true
  const res = await deleteRoleApi(row.id).finally(() => {
    delLoading.value = false
  })
  if (res.code) {
    ElMessage.success('删除成功！')
  }
  getList()
}
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
        ElMessage.success('创建成功')
      }
    }
  })
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
const bindMenuRef = ref()
const bindMenuLoading = ref(false)
const updateMenus = async () => {
  bindMenuLoading.value = true
  const nodes = bindMenuRef.value.getCheckedNodes()
  let roleMenus: RoleMenu[] = []
  nodes.forEach((element: Menu) => {
    roleMenus.push({ roleId: tableObject.currentRow?.id as string, menuId: element.id })
  })
  const res = await bindMenuApi(roleMenus)
    .catch((err) => err)
    .finally(() => {
      bindMenuLoading.value = false
    })

  if (res.code) {
    ElMessage.success('操作成功！')
  }
  dialogVisible.value = false
}
// 打开授权管理对话框
const openAuthorizeDialog = (row: Role) => {
  tableObject.currentRow = row
  dialogTitle.value = `${t('role.authorize')}: ${row.roleName}` //这里注意，需要跟国际化配置关联
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
    <BindMenu v-if="dialogType === 'bindMenu'" ref="bindMenuRef" />
    <Authorize
      v-if="dialogType === 'authorize'"
      :currentRole="(tableObject.currentRow as Object)"
    />
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
        :loading="createLoading"
        @click="updateMenus"
      >
        {{ t('common.ok') }}
      </ElButton>
      <ElButton @click="handleDialogClose">{{ t('common.cancel') }}</ElButton>
    </template>
  </Dialog>
</template>

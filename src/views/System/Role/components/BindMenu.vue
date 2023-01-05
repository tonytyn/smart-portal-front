<script setup lang="ts">
import { ref, unref, reactive } from 'vue'
import { ElTree } from 'element-plus'
import { searchMenuTreeApi } from '@/api/menu'
import { getBoundedMenuApi } from '@/api/role'

const props = defineProps({
  roleId: {
    type: String,
    default: ''
  }
})

const treeData = reactive({ data: [] })
const defaultCheckedKeys = reactive({ ids: [] })
const loading = ref(false)
const initTreeData = async () => {
  loading.value = true
  const res = await searchMenuTreeApi()
  loading.value = false
  if (res.code) {
    treeData.data = res.data.tree
  }
  const res2 = await getBoundedMenuApi(props.roleId)
  defaultCheckedKeys.ids = res2.data
}
initTreeData()
const treeRef = ref()
const getCheckedKeys = () => {
  return unref(treeRef).getCheckedKeys()
}
const getHalfCheckedKeys = () => {
  return unref(treeRef).getHalfCheckedKeys()
}
const treeProps = {
  label: 'menuName'
}

defineExpose({
  getCheckedKeys,
  getHalfCheckedKeys
})
</script>

<template>
  <ElTree
    ref="treeRef"
    v-loading="loading"
    :data="treeData.data"
    node-key="id"
    :props="treeProps"
    show-checkbox
    default-expand-all
    :default-checked-keys="defaultCheckedKeys.ids"
  />
</template>

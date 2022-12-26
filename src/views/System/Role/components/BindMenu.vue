<script setup lang="ts">
import { ref, unref, reactive } from 'vue'
import { ElTree } from 'element-plus'
import { searchMenuTreeApi } from '@/api/menu'
const treeData = reactive({ data: [] })
const loading = ref(false)
const initTreeData = async () => {
  loading.value = true
  const res = await searchMenuTreeApi()
  loading.value = false
  if (res.code) {
    treeData.data = res.data
  }
}
initTreeData()
// const treeRef = ref()
// ElForm实例
const treeRef = ref()
const getCheckedNodes = () => {
  const tree = unref(treeRef)
  const nodes = tree!.getCheckedNodes(false, true)
  return nodes
}
const props = {
  label: 'menuName'
}

defineExpose({
  getCheckedNodes
})
</script>

<template>
  <ElTree
    ref="treeRef"
    v-loading="loading"
    :data="treeData.data"
    node-key="id"
    :props="props"
    show-checkbox
    default-expand-all
  />
</template>

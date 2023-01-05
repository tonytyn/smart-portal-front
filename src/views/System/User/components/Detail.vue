<script setup lang="ts">
import { reactive, PropType } from 'vue'
import { ElTag } from 'element-plus'
import { Descriptions } from '@/components/Descriptions'
import { useI18n } from '@/hooks/web/useI18n'
import { DescriptionsSchema } from '@/types/descriptions'
import { User } from '@/api/user/types'
import { getRoleByIdApi } from '@/api/role'
const { t } = useI18n()

const props = defineProps({
  currentRow: {
    type: Object as PropType<Nullable<User>>,
    default: () => null
  },
  detailSchema: {
    type: Array as PropType<DescriptionsSchema[]>,
    default: () => []
  }
})
const roleList = reactive<any[]>([])

if (props.currentRow && props.currentRow.roleIds) {
  props.currentRow!.roleIds.forEach(async (roleId: any) => {
    const res = await getRoleByIdApi(roleId)
    roleList.push(res.data)
  })
}
</script>

<template>
  <Descriptions :schema="props.detailSchema" :data="props.currentRow || {}">
    <template #state="{ row }">
      <ElTag :type="row.state === 'enable' ? 'success' : 'danger'">
        {{ row.state === 'enable' ? t('common.enable') : t('common.disable') }}
      </ElTag>
    </template>
    <template #roleIds>
      <ElTag v-for="role in roleList" :key="role.id">
        {{ role.roleName }}
      </ElTag>
    </template>
  </Descriptions>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { ElTag } from 'element-plus'
import { Descriptions } from '@/components/Descriptions'
import { useI18n } from '@/hooks/web/useI18n'
import { DescriptionsSchema } from '@/types/descriptions'
import { User } from '@/api/user/types'
const { t } = useI18n()

defineProps({
  currentRow: {
    type: Object as PropType<Nullable<User>>,
    default: () => null
  },
  detailSchema: {
    type: Array as PropType<DescriptionsSchema[]>,
    default: () => []
  }
})
</script>

<template>
  <Descriptions :schema="detailSchema" :data="currentRow || {}">
    <template #state="{ row }">
      <ElTag :type="row.state === 'enable' ? 'success' : 'danger'">
        {{ row.state === 'enable' ? t('common.enable') : t('common.disable') }}
      </ElTag>
    </template>
  </Descriptions>
</template>

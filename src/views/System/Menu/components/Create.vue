<script setup lang="ts">
import { reactive, PropType } from 'vue'
import { Form } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'
// import { Menu } from '@/api/menu/types'

const props = defineProps({
  formSchema: {
    type: Array as PropType<FormSchema[]>,
    default: () => []
  }
})

const { register, methods, elFormRef } = useForm({
  schema: props.formSchema
})
// 定义校验规则
const { required } = useValidator()
const rules = reactive({
  parentId: [required()],
  menuName: [required()],
  menuCode: [required()],
  menuType: [required()]
})
// 导出
defineExpose({
  elFormRef,
  getFormData: methods.getFormData
})
</script>

<template>
  <Form :rules="rules" @register="register" />
</template>

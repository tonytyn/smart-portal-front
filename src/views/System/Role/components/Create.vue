<script setup lang="ts">
import { Form } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'

const { required } = useValidator()

const props = defineProps({
  formSchema: {
    type: Array as PropType<FormSchema[]>,
    default: () => []
  }
})

const rules = reactive({
  roleName: [required()]
})

const { register, methods, elFormRef } = useForm({
  schema: props.formSchema
})

defineExpose({
  elFormRef,
  getFormData: methods.getFormData
})
</script>

<template>
  <Form :rules="rules" @register="register" />
</template>

<template>
  <div class="formation-selector bg-white rounded-lg shadow-lg p-4">
    <div class="flex items-end gap-3">
      <!-- フォーメーション選択ドロップダウン -->
      <div class="flex-1">
        <label class="block text-sm font-medium text-gray-700 mb-2">フォーメーション選択</label>
        <select
          :value="modelValue"
          @change="handleChange"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          :disabled="!editable"
        >
          <option value="">フォーメーションを選択</option>
          <option
            v-for="formation in formationList"
            :key="formation.name"
            :value="formation.name"
          >
            {{ formation.displayName }}
          </option>
        </select>
      </div>

      <!-- 適用ボタン -->
      <button
        v-if="editable && modelValue"
        @click="applyFormation"
        class="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
      >
        適用
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFormations } from '@/composables/useFormations'

interface Props {
  modelValue: string
  editable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  editable: true
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  apply: [formationName: string]
}>()

const { getFormationList } = useFormations()
const formationList = getFormationList()

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}

const applyFormation = () => {
  if (!props.modelValue) return
  emit('apply', props.modelValue)
}
</script>

<style scoped>
.formation-card {
  cursor: pointer;
}

.formation-card:disabled {
  cursor: not-allowed;
}
</style>


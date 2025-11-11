<template>
  <div class="relative">
    <button
      @click="toggleMenu"
      class="text-gray-300 hover:text-white text-base whitespace-nowrap flex items-center"
    >
      示例
      <i class="fa fa-chevron-down ml-1 text-xs"></i>
    </button>
    <div
      v-if="showMenu"
      class="absolute top-full mt-1 w-48 bg-gray-700 rounded shadow-lg z-50"
    >
      <button
        v-for="sample in samples"
        :key="sample.name"
        @click="selectSample(sample)"
        class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-600"
      >
        {{ sample.name }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showMenu = ref(false);

const props = defineProps({
  samples: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['select']);

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

const selectSample = (sample) => {
  emit('select', sample);
  showMenu.value = false;
};
</script>

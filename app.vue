<template>
  <div class="container max-w-5xl py-32 px-8">
    <div class="flex flex-col md:flex-row gap-8 mb-8">
      <UTextarea class="flex-1" v-model="input1" />
      <UTextarea class="flex-1" v-model="input2" />
    </div>
    <UButton @click="calculateSimilarity">Calculate similarity</UButton>
    <p class="mt-8 text-3xl">
      Output: <span class="font-bold">{{ similarity }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">

const input1 = ref('')
const input2 = ref('')

const similarity = ref(0)

function calculateSimilarity() {
  similarity.value++
  console.log(similarity)
}

</script>

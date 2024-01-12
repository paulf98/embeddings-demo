<template>
  <div class="container max-w-5xl py-32 px-8">
    <div class="flex flex-col md:flex-row gap-8 mb-8">
      <UTextarea class="flex-1" v-model="input1" />
      <UTextarea class="flex-1" v-model="input2" />
    </div>
    <UButton :loading="isLoading" @click="async () => await calculateSimilarity()">Calculate similarity</UButton>

    <p class="mt-8 text-3xl">
      Output: <span class="font-bold">{{ similarity }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
const input1 = ref('The world is a beautiful place to be.')
const input2 = ref('The word is a sad place.')

const isLoading = ref(false)

const similarity = ref(0)

async function calculateSimilarity() {
  isLoading.value = true
  const { data, pending } = await useFetch('/api/feature-extraction', {
    method: 'POST',
    body: JSON.stringify({
      text1: input1.value,
      text2: input2.value,
    }),
  })
  isLoading.value = pending.value


  similarity.value = data?.value ?? 0
}

</script>

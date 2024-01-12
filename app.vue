<template>
  <div class="container max-w-5xl py-32 px-8">
    <h1 class="text-3xl mb-8 text-center0">Ähnlichkeit berechnen</h1>
    <UForm :state="state" class="flex flex-1 flex-col md:flex-row gap-8 mb-8"
      @submit="async () => await calculateSimilarity()">
      <UFormGroup label="Eingabe 1" class="flex-1">
        <UTextarea v-model="state.input1" />
      </UFormGroup>

      <UFormGroup label="Eingabe 2" class="flex-1">
        <UTextarea v-model="state.input2" />
      </UFormGroup>
      <UButton :loading="isLoading" type="submit">Calculate similarity</UButton>
    </UForm>

    <p class="mt-8 text-3xl">
      Kosinusähnlichkeit: <span class="font-bold">{{ cosSimilarity }} %</span>
    </p>
    <p class="mt-8 text-3xl">
      Kreuzprodukt: <span class="font-bold">{{ dotSimilarity }} %</span>
    </p>
    <p class="mt-8 text-3xl">
      Euklidische Distanz: <span class="font-bold">{{ euclidSimilarity }} %</span>
    </p>

  </div>
</template>

<script setup lang="ts">

const state = reactive({
  input1: 'I like bananas',
  input2: 'I like fruits',
})

const isLoading = ref(false)

const cosSimilarity = ref(0)
const dotSimilarity = ref(0)
const euclidSimilarity = ref(0)

async function calculateSimilarity() {
  console.log(state.input1, state.input2)
  isLoading.value = true
  const { data, pending } = await useFetch('/api/feature-extraction', {
    method: 'POST',
    body: JSON.stringify({
      text1: state.input1,
      text2: state.input2,
    }),
  })
  isLoading.value = pending.value

  if (!data || !data.value) return

  cosSimilarity.value = data.value.cosSimilarity ?? 0
  dotSimilarity.value = data.value.dotSimilarity ?? 0
  euclidSimilarity.value = data.value.euclidSimilarity ?? 0
}

</script>

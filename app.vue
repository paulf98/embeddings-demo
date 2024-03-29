<template>
  <div class="container mx-auto max-w-5xl py-16 px-8">
    <h1 class="text-3xl mb-8 text-center">Ähnlichkeit berechnen</h1>
    <UForm :state="state" @submit="async () => await calculateSimilarity()">
      <div class="flex flex-1 flex-col md:flex-row gap-8 mb-8">

        <UFormGroup label="Eingabe 1" class="flex-1">
          <UTextarea v-model="state.input1" />
        </UFormGroup>

        <UFormGroup label="Eingabe 2" class="flex-1">
          <UTextarea v-model="state.input2" />
        </UFormGroup>
      </div>

      <URadioGroup v-model="state.method" legend="Methode auswählen" :options="methodOptions" class="my-4" />

      <UButton :loading="isLoading" type="submit">Berechnen</UButton>
    </UForm>

    <div class="flex flex-col gap-4 py-8">
      <p class="text-xl">
        Kosinusähnlichkeit: <span class="font-bold">{{ cosSimilarity }} %</span>
      </p>
      <p class="text-xl">
        Kreuzprodukt: <span class="font-bold">{{ dotSimilarity }} %</span>
      </p>
      <p class="text-xl">
        Euklidische Distanz: <span class="font-bold">{{ euclidSimilarity }} %</span>
      </p>
    </div>
    <hr>
    <div class="py-8">
      <h1 class="text-3xl mb-4">Saved Results</h1>
      <div class="flex gap-2 mb-4">
        <span class="bg-amber-200 px-4 py-1 rounded-full">
          transformers
        </span>
        <span class="bg-green-200 px-4 py-1 rounded-full">
          inference
        </span>
      </div>
      <div class="flex flex-col gap-4">
        <div v-for="result in results" class="border rounded-md shadow-sm p-4 relative"
          :class="result.method == 'inference' ? 'bg-green-200' : 'bg-amber-200'">
          <div class="bg-white px-4 py-1 rounded-full absolute bottom-4 right-4">
            {{ result.model }}
          </div>
          <p>{{ result.input1 }}</p>
          <p>{{ result.input2 }}</p>
          <p>
            Kosinusähnlichkeit: <span class="font-bold">{{ result.cosSimilarity }} %</span>
          </p>
          <p>
            Kreuzprodukt: <span class="font-bold">{{ result.dotSimilarity }} %</span>
          </p>
          <p>
            Euklidische Distanz: <span class="font-bold">{{ result.euclidSimilarity }} %</span>
          </p>
          <button class="bg-red-500 text-white px-3 py-2 rounded-full absolute top-4 right-4"
            @click="() => deleteFromLocalStorage(result.id)">
            <UIcon name="i-heroicons-trash" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const methodOptions = [{
  value: 'transformers',
  label: 'Transformers'
}, {
  value: 'inference',
  label: 'Inference'
}]

const state = reactive({
  input1: 'I like bananas',
  input2: 'I like fruits',
  method: 'transformers',
})

const isLoading = ref(false)

const cosSimilarity = ref(0)
const dotSimilarity = ref(0)
const euclidSimilarity = ref(0)
const model = ref('')

async function calculateSimilarity() {
  isLoading.value = true
  const { data, pending } = await useFetch(`/api/feature-extraction/${state.method}`, {
    method: 'POST',
    body: JSON.stringify({
      text1: state.input1,
      text2: state.input2,
    }),
  })
  isLoading.value = pending.value

  if (!data || !data.value) return

  cosSimilarity.value = (data.value as any).cosSimilarity ?? 0
  dotSimilarity.value = (data.value as any).dotSimilarity ?? 0
  euclidSimilarity.value = (data.value as any).euclidSimilarity ?? 0
  model.value = (data.value as any).model ?? ''


  saveResultLocally()
}

const localStorage = process.client ? window.localStorage : null

type Result = {
  id: number
  input1: string
  input2: string
  method: string
  cosSimilarity: number
  dotSimilarity: number
  euclidSimilarity: number
  model: string
}

/**
 * Save the Result of the Calculation to the Local Storage
 * 
 */
function saveResultLocally() {
  const result = {
    id: Date.now(),
    input1: state.input1,
    input2: state.input2,
    method: state.method,
    cosSimilarity: cosSimilarity.value,
    dotSimilarity: dotSimilarity.value,
    euclidSimilarity: euclidSimilarity.value,
    model: model.value,
  }

  if (!localStorage) return
  // check if there is a results array in the local storage
  let localResults = localStorage.getItem('results')
  if (!localResults) {
    localStorage.setItem('results', "[]")
    localResults = localStorage.getItem('results') ?? '[]'
  }

  // add the new result to the array
  localStorage.setItem('results', JSON.stringify([...JSON.parse(localResults), result]))
  results.value = JSON.parse(localStorage.getItem('results') ?? '[]')
}

const results = ref<Result[] | []>(JSON.parse(localStorage?.getItem('results') ?? '[]'))

function deleteFromLocalStorage(id: number) {
  if (!localStorage) return
  const localResults = localStorage.getItem('results')
  if (!localResults) return

  const parsedResults = JSON.parse(localResults)
  const filteredResults = parsedResults.filter((result: Result) => result.id !== id)
  localStorage.setItem('results', JSON.stringify(filteredResults))
  results.value = JSON.parse(localStorage.getItem('results') ?? '[]')
}

</script>

<template>
  <div class="app-container">
    Nuxt module playground!
    <br>
    {{ n(1, 'currency') }}
    <br>
    {{ d(date, 'long') }}
    <br>
    {{ date }}
    <br>
    <!-- {{ messages }}
    {{ locale }} -->
    <br>
    <br>
    <div>
      <i18n-n
        tag="span"
        :value="1234"
        :format="{ key: 'currency', currency: 'EUR' }"
      />
      <br>
      <i18n-n
        tag="span"
        :value="1234"
        :format="{ key: 'currency', currency: 'DKK' }"
      />
    </div>
    <br>
    <!-- {{ numberFormats. }} -->
  </div>
</template>

<script setup lang="ts">
const { d, n } = useI18n()

const date = ref(new Date())
</script>

<style>
.app-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}
</style>

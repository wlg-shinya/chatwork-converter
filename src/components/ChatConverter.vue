<script setup lang="ts">
function test() {
  console.log("test")
}
</script>

<template>
  <div>
    <button @click="test()">test</button>
  </div>
</template>
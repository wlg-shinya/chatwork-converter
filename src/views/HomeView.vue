<script setup lang="ts">
import GlobalSettings from '@/global-settings'
import ChatConverter from '@/components/ChatConverter.vue'
document.title = GlobalSettings.title
</script>

<template>
  <ChatConverter />
</template>
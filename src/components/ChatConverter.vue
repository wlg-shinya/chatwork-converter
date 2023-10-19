<script setup lang="ts">
import axios from "axios"

function test() {
  axios
    .get("/api/chatwork_get_message", {
      params: {
        room_id: "338454030",
        message_id: "1766718668491759616"
      },
    })
    .then((response) => {
      const data = JSON.parse(JSON.stringify(response.data))
      console.log(data)
    })
    .catch((err) => {
      throw err
    })
}
</script>

<template>
  <div>
    <button @click="test()">test</button>
  </div>
</template>
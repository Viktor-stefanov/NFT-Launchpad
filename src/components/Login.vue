<template>
  <h1>Welcome to NFT trader!</h1>
  <div v-if="hasMetamask">
    <button @click="getUserAccounts">Connect metamask</button>
  </div>
  <div v-else>
    <h3>Install the metamask web extension first.</h3>
  </div>
</template>

<script>
import { hasMetamask, getUserAddresses } from "../util/metaMask.js"

export default {
  data() {
    return {
      hasMetamask: false,
    }
  },
  mounted() {
    this.hasMetamask = hasMetamask(); 
  },
  methods: {
    async getUserAccounts() {
      const addresses = await getUserAddresses();
      this.$emit("gotUserAddresses", addresses);
    }
  },
  emits: ["gotUserAddresses"]
}
</script>

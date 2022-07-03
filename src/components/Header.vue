<template>
  <Login
    v-if="userAddresses.length === 0"
    @gotUserAddresses="getUserAddresses"
  />
  <div v-else>
    <button @click="showingSection = 'Create'">Create NFT</button>
    <button @click="showingSection = 'Browse'">Browse NFTs</button>
    <button @click="showingSection = 'Sell'">My NFTs</button>
    <h5>Account: {{ userAddresses[0] }}</h5>
    <h5 v-if="userBalance">Balance: {{ userBalance }} ETH</h5>
    <br />
    <br />
    <CreateNft
      v-if="showingSection === 'Create'"
      :userAddress="this.userAddresses[0]"
    />
    <MyNFTs
      v-if="showingSection === 'Sell'"
      :userAddress="this.userAddresses[0]"
    />
    <Browse
      v-if="showingSection === 'Browse'"
      :userAddress="this.userAddresses[0]"
    />
  </div>
</template>

<script>
import { getUserBalance } from "../util/metaMask";
import Login from "./Login.vue";
import CreateNft from "./CreateNft.vue";
import MyNFTs from "./MyNFTs.vue";
import Browse from "./Browse.vue";
import "../util/contracts";

export default {
  data() {
    return {
      userAddresses: [],
      userBalance: null,
      showingSection: null,
    };
  },
  methods: {
    async getUserAddresses(addresses) {
      this.userAddresses = addresses;
      this.userBalance = await getUserBalance(addresses[0]);
      window.ethereum.on("accountsChanged", async (accounts) => {
        this.userAddresses = accounts;
        this.userBalance = await getUserBalance(accounts[0]);
      });
    },
  },
  components: { Login, CreateNft, MyNFTs, Browse },
};
</script>

<style scoped>
h5 {
  display: inline;
  margin: 15px;
}
</style>

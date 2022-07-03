<template>
  <div v-for="(NFT, i) in NFTs" :key="i">
    <div class="nft-card">
      <img class="nft-image" :src="NFT.metadata.image" alt="NFT Avatar" />
      <img alt="NFT Avatar" />
      <div class="nft-container">
        <h4 class="nft-title" v-text="NFT.metadata.title"></h4>
        <p class="nft-description" v-text="NFT.metadata.description"></p>
      </div>
    </div>
  </div>
</template>

<script>
//import { getOwnNFTs } from "../util/getNFTs";

export default {
  name: "NFT-Marketplace",
  data() {
    return {
      NFTs: [],
    };
  },

  async beforeMount() {
    //this.NFTs = await getOwnNFTs();
  },
};
</script>

<style scoped>
div.nft-card {
  float: left;
  margin: 15px;
}
</style>

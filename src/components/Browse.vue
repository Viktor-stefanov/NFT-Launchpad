<template>
  <div v-for="(metadata, index) in allNFTs" :key="index">
    <p>Name: {{ metadata.name }}</p>
    <img :src="metadata.imageURL" alt="NFT Image" />
    <p>Owner {{ metadata.owner }}</p>
    <p>Description: {{ metadata.description }}</p>
    <p>Price: {{ metadata.price }}</p>
    <div v-if="metadata.owner.toLowerCase() !== userAddress">
      <button type="submit" @click="buyNFT(metadata.id, metadata.price)">
        Buy NFT!
      </button>
    </div>
  </div>
</template>

<script>
import { getSellingNFTs, buyNFT } from "../util/contracts";

export default {
  data() {
    return {
      allNFTs: [],
    };
  },
  async mounted() {
    this.allNFTs = await getSellingNFTs();
  },
  methods: {
    async buyNFT(tokenId, price) {
      await buyNFT(tokenId, price);
    },
  },
  props: { userAddress: String },
};
</script>

<style scoped>
div {
  display: inline;
  margin: 15px;
}
</style>

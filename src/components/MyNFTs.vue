<template>
  <div v-for="(metadata, index) in myNFTs" :key="index">
    <p>Name: {{ metadata.name }}</p>
    <p>Description: {{ metadata.description }}</p>
    <img :src="metadata.imageUri" alt="NFT Image" />
    <br />
    <div v-if="!metadata.isSelling">
      <div v-if="!metadata.isStaking">
        <span>Staking your NFT will yield you 50 NFTOs / month</span>
        <button type="submit" @click="stakeMyNFT(index)">Stake my NFT</button>
        <br />
      </div>
      <div v-else>
        <span>Unstake your NFT</span>
        <button type="submit" @click="unstakeMyNFT(index)">
          Unstake my NFT
        </button>
      </div>
      <span>Price (in NFTokens)</span>
      <input :id="`${index}price`" type="number" />
      <br />
      <button type="submit" @click="listMyNFT(index)">List my NFT</button>
    </div>
    <div v-else>
      <p>Selling for {{ metadata.price }} NFTO</p>
    </div>
  </div>
</template>

<script>
import { getUserNFTs, listNFT, stakeNFT, unstakeNFT } from "../util/contracts";

export default {
  data() {
    return {
      myNFTs: [],
    };
  },
  async mounted() {
    this.myNFTs = await getUserNFTs(this.userAddress);
  },
  methods: {
    async listMyNFT(index) {
      const price = document.getElementById(`${index}price`).value;
      const id = this.myNFTs[index].id;
      await listNFT(this.userAddress, id, price);
    },
    async stakeMyNFT(index) {
      const id = this.myNFTs[index].id;
      await stakeNFT(this.userAddress, id);
    },
    async unstakeMyNFT(index) {
      const id = this.myNFTs[index].id;
      await unstakeNFT(this.userAddress, id);
    },
  },
  props: { userAddress: String },
};
</script>

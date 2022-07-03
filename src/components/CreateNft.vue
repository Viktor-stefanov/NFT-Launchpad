<template>
  <span>Title</span>
  <input type="text" id="nft-title" />
  <br />
  <span>Description</span>
  <input type="text" id="nft-description" />
  <br />
  <br />
  <input
    type="file"
    accept="img/**"
    id="nft-image"
    @change="uploadImage($event)"
  />
  <br />
  <p>
    {{ mintPrice === 0 ? "Firts mint is free" : `Price: ${mintPrice} NFTO` }}
  </p>
  <button type="submit" @click="mintNFT()">Mint NFT</button>
  <br />
  <p v-if="mintedNft.tokenId">
    Your NFT's ID (store this information!): {{ mintedNft.tokenId }}
  </p>
  <p v-if="mintedNft.tokenUri">Your NFT's URI: {{ mintedNft.tokenUri }}</p>
  <br />
</template>

<script>
import { uploadFileToIPFS } from "../util/IPFS";
import {
  mintNft,
  getContractInstance,
  getMintCount,
  stakeNFT,
  unstakeNFT,
} from "../util/contracts";

export default {
  data() {
    return {
      mintedNft: {
        id: null,
        uri: null,
      },
      NFTMetadata: {
        title: null,
        description: null,
        image: null,
      },
      metadataURL: null,
      mintPrice: null,
      mintPriceMsg: null,
    };
  },
  async mounted() {
    const mintCount = await getMintCount(this.userAddress);
    this.mintPrice = mintCount.isZero()
      ? 0
      : 5 + ((mintCount % 101) / 5000) * 100;
    const c = getContractInstance();
    c.on("NftMinted", (tokenId, tokenUri) => {
      this.mintedNft = { tokenId, tokenUri };
    });
  },
  methods: {
    async uploadToIPFS() {
      if (this.NFTMetadata["image"]) {
        let { _, path } = await uploadFileToIPFS(this.NFTMetadata["image"]);
        this.NFTMetadata["image"] = `https://ipfs.io/ipfs/${path}`;
        const binaryData = Buffer.from(JSON.stringify(this.NFTMetadata));
        ({ _, path } = await uploadFileToIPFS(binaryData));
        this.metadataURL = `https://ipfs.io/ipfs/${path}`;
      }
    },

    uploadImage(event) {
      this.NFTMetadata["image"] = event.target.files[0];
    },

    collectMetadata() {
      const title = document.getElementById("nft-title").value;
      const description = document.getElementById("nft-description").value;
      if (!title) {
        return "failed";
      }
      this.NFTMetadata["title"] = title;
      this.NFTMetadata["description"] = description;
    },

    async mintNFT() {
      if (this.collectMetadata() != "failed" && this.NFTMetadata["image"]) {
        await this.uploadToIPFS();
        mintNft(this.NFTMetadata, this.metadataURL, this.mintPrice);
      }
    },
  },
  props: { userAddress: String },
};
</script>

import { ethers } from "ethers";
import NftsMetadata from "../../artifacts/contracts/NFTs.sol/NFTs.json";
import NftsAddress from "../../artifacts/contracts/NFTs.sol/NFTs.address.json";
import NFTokenMetadata from "../../artifacts/contracts/NFToken.sol/NFToken.json";
import NFTokenAddress from "../../artifacts/contracts/NFToken.sol/NFToken.address.json";

let Nfts = null,
  NFToken = null;
[Nfts, NFToken] = getContractInstance();

async function mintNft(metadata, metadataURL, price) {
  price = ethers.utils.parseEther(price.toString());
  if (!price.isZero()) {
    await NFToken.approve(NftsAddress, price);
  }
  await Nfts.mintNFT(
    metadata.title,
    metadata.description,
    metadata.image,
    metadataURL,
    price
  );
}

async function sellNFT(tokenId, price, receiver) {
  price = ethers.utils.parseEther(price.toString());
  await Nfts.sellNFT(tokenId, price, receiver);
}

async function listNFT(owner, tokenId, price) {
  await Nfts.listNFT(owner, tokenId, price);
}

async function buyNFT(tokenId, price) {
  price = ethers.utils.parseEther(price.toString());
  await NFToken.approve(NftsAddress, price);
  await Nfts.sellNFT(tokenId, price);
}

async function stakeNFT(owner, tokenId) {
  await Nfts.stakeNFT(owner, tokenId);
}

async function unstakeNFT(owner, tokenId) {
  await Nfts.unstakeNFT(owner, tokenId);
}

async function getUserNFTs(address) {
  let myNFTs = [];
  const totalTokens = await Nfts.getTotalNFTsCount();
  for (let tokenId = 1; tokenId < totalTokens.add(1); tokenId++) {
    const userNFT = await Nfts.getNFT(tokenId);
    if (userNFT.owner.toLowerCase() === address.toLowerCase()) {
      myNFTs.push({
        name: userNFT.name,
        description: userNFT.description,
        imageUri: userNFT.imageUri,
        id: userNFT.id,
        uri: userNFT.uri,
        isSelling: userNFT.isSelling,
        isStaking: userNFT.isStaking,
        price: userNFT.price,
      });
    }
  }

  return myNFTs;
}

async function getSellingNFTs() {
  let sellingNFTs = [];
  const tokenCount = await Nfts.getTotalNFTsCount();
  for (let tokenId = 1; tokenId < tokenCount.add(1); tokenId++) {
    const userNFT = await Nfts.getNFT(tokenId);
    if (userNFT.isSelling)
      sellingNFTs.push({
        name: userNFT.name,
        description: userNFT.description,
        imageUri: userNFT.imageUri,
        id: userNFT.id,
        uri: userNFT.uri,
        isSelling: userNFT.isSelling,
        isStaking: userNFT.isStaking,
        price: userNFT.price,
        owner: userNFT.owner,
      });
  }

  return sellingNFTs;
}

async function getMintCount(address) {
  return await Nfts.MintCount(address);
}

function getContractInstance() {
  if (!Nfts) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const c1 = new ethers.Contract(NftsAddress, NftsMetadata.abi, signer);
    const c2 = new ethers.Contract(NFTokenAddress, NFTokenMetadata.abi, signer);
    return [c1, c2];
  } else return Nfts;
}

async function test() {
  console.log(
    await NFToken.balanceOf("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199")
  );
}

test();

export {
  mintNft,
  getContractInstance,
  getUserNFTs,
  sellNFT,
  listNFT,
  getSellingNFTs,
  buyNFT,
  getMintCount,
  stakeNFT,
  unstakeNFT,
};

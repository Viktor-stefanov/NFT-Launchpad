import { ethers } from "ethers";

function hasMetamask() {
  return window.ethereum !== undefined;
}

async function getUserAddresses() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  return await provider.send("eth_requestAccounts", []);
}

async function getUserBalance(account) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  return ethers.utils.formatEther(await provider.getBalance(account));
}

export { hasMetamask, getUserAddresses, getUserBalance };

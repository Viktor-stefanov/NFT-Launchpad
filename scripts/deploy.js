const fs = require("fs");
const path = require("path");
const { ethers } = require("hardhat");

async function deploy(name, args) {
  const Contract = await ethers.getContractFactory(name);
  const contract = args ? await Contract.deploy(args) : await Contract.deploy();
  updateContractConfig(name, contract.address);
  console.log(`Successfully deployed ${name} contract.`);

  return contract;
}

function updateContractConfig(name, address) {
  fs.writeFileSync(
    path.join(
      __dirname,
      "..",
      `artifacts/contracts/${name}.sol/${name}.address.json`
    ),
    JSON.stringify(address)
  );
}

async function main() {
  const c = await deploy(
    "NFToken",
    "0xdD2FD4581271e230360230F9337D5c0430Bf44C0"
  );
  await deploy("NFTs", c.address);
}

main();

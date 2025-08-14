const hre = require("hardhat");

async function main() {
  const EduChainNFT = await hre.ethers.getContractFactory("EduChainNFT");
  const eduChain = await EduChainNFT.deploy();
  await eduChain.waitForDeployment();

  const address = await eduChain.getAddress();
  console.log("✅ EduChainNFT deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

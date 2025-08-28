const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying EduChainNFT to Sepolia...");
  
  const EduChainNFT = await hre.ethers.getContractFactory("EduChainNFT");
  console.log("📋 Contract factory created");
  
  const eduChain = await EduChainNFT.deploy();
  console.log("⏳ Waiting for deployment...");
  
  await eduChain.waitForDeployment();
  const address = await eduChain.getAddress();
  
  console.log("✅ EduChainNFT deployed to:", address);
  
  console.log("🔍 Contract details:");
  console.log("📍 Address:", address);
  console.log("🔗 Network:", hre.network.name);
  
  console.log("\n💡 Next steps:");
  console.log("1. Copy the contract address above");
  console.log("2. Update your .env file with NFT_CONTRACT_ADDRESS=" + address);
  console.log("3. Test the NFT minting functionality!");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});

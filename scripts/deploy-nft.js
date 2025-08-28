const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying EduChainNFT contract...");

  // Get the contract factory
  const EduChainNFT = await ethers.getContractFactory("EduChainNFT");
  
  // Deploy the contract
  const nftContract = await EduChainNFT.deploy();
  
  // Wait for deployment to finish
  await nftContract.waitForDeployment();
  
  const contractAddress = await nftContract.getAddress();
  
  console.log("✅ EduChainNFT deployed successfully!");
  console.log("📍 Contract Address:", contractAddress);
  console.log("🔗 Network:", (await ethers.provider.getNetwork()).name);
  
  // Save deployment info
  const deploymentInfo = {
    contractName: "EduChainNFT",
    contractAddress: contractAddress,
    network: (await ethers.provider.getNetwork()).name,
    deployer: (await ethers.provider.getSigner()).address,
    deploymentTime: new Date().toISOString()
  };
  
  console.log("\n📋 Deployment Information:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  
  console.log("\n💡 Next steps:");
  console.log("1. Copy the contract address above");
  console.log("2. Update your .env file with NFT_CONTRACT_ADDRESS=" + contractAddress);
  console.log("3. Update your backend blockchain service with the new address");
  console.log("4. Test the minting functionality!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });






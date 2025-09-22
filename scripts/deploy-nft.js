const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting EduChainNFT deployment...");

  // Get the contract factory
  const EduChainNFT = await ethers.getContractFactory("EduChainNFT");

  // Deploy the contract
  console.log("📝 Deploying contract...");
  const nft = await EduChainNFT.deploy("EduChain Certificates", "EDUCHAIN");

  // Wait for deployment to finish
  await nft.deployed();

  console.log("✅ EduChainNFT deployed to:", nft.address);
  console.log("📋 Contract name:", await nft.name());
  console.log("📋 Contract symbol:", await nft.symbol());
  console.log("👤 Contract owner:", await nft.owner());

  // Set up default royalty (5%)
  console.log("💰 Setting up default royalty (5%)...");
  const [deployer] = await ethers.getSigners();
  await nft.setDefaultRoyalty(deployer.address, 500); // 500 basis points = 5%
  
  console.log("✅ Default royalty set to 5% for owner:", deployer.address);

  // Test minting a sample NFT
  console.log("🎨 Testing minting functionality...");
  try {
    const sampleMetadata = {
      name: "Sample EduChain Certificate",
      description: "This is a sample certificate for testing purposes",
      image: "https://via.placeholder.com/400x400/6366f1/ffffff?text=Sample+Certificate",
      attributes: [
        { trait_type: "Type", value: "Certificate" },
        { trait_type: "Issuer", value: "EduChain" },
        { trait_type: "Level", value: "Test" }
      ]
    };

    // In a real deployment, you would upload this to IPFS first
    const sampleTokenURI = "ipfs://QmSampleHashForTesting";
    
    const mintTx = await nft.safeMint(
      deployer.address, // Mint to deployer
      sampleTokenURI,
      deployer.address, // Royalty receiver
      500 // 5% royalty
    );

    const mintReceipt = await mintTx.wait();
    const mintEvent = mintReceipt.events?.find(e => e.event === 'NFTMinted');
    const tokenId = mintEvent ? mintEvent.args.tokenId.toString() : 'unknown';

    console.log("✅ Sample NFT minted successfully!");
    console.log("📋 Token ID:", tokenId);
    console.log("🔗 Transaction hash:", mintTx.hash);
  } catch (error) {
    console.log("⚠️  Sample minting failed (this is normal if IPFS is not set up):", error.message);
  }

  // Display contract information
  console.log("\n📊 Contract Information:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Contract Address:", nft.address);
  console.log("Contract Name:", await nft.name());
  console.log("Contract Symbol:", await nft.symbol());
  console.log("Owner:", await nft.owner());
  console.log("Default Royalty:", "5% (500 basis points)");
  console.log("Total Supply:", (await nft.totalSupply()).toString());
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // Save deployment info to file
  const deploymentInfo = {
    contractAddress: nft.address,
    contractName: await nft.name(),
    contractSymbol: await nft.symbol(),
    owner: await nft.owner(),
    defaultRoyaltyBPS: 500,
    deploymentTime: new Date().toISOString(),
    network: await ethers.provider.getNetwork(),
    deployer: deployer.address
  };

  const fs = require('fs');
  const path = require('path');
  
  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, '..', 'deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  // Save deployment info
  const deploymentFile = path.join(deploymentsDir, `EduChainNFT-${Date.now()}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  
  console.log("💾 Deployment info saved to:", deploymentFile);

  // Instructions for next steps
  console.log("\n🎯 Next Steps:");
  console.log("1. Update your .env file with the contract address:");
  console.log(`   NFT_CONTRACT_ADDRESS=${nft.address}`);
  console.log("2. Verify the contract on Etherscan (if on mainnet/testnet)");
  console.log("3. Test the minting functionality through your frontend");
  console.log("4. Set up IPFS metadata upload in your backend");

  return nft.address;
}

// Execute deployment
main()
  .then((contractAddress) => {
    console.log("\n🎉 Deployment completed successfully!");
    console.log("Contract deployed at:", contractAddress);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
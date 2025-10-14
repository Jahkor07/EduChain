#!/usr/bin/env node

/**
 * Start Local Hardhat Network
 * 
 * This script starts a local Hardhat network that can be used by external clients
 * like MetaMask or your frontend application.
 * 
 * Usage:
 *   node scripts/start-local-network.js
 *   or
 *   npx hardhat node
 */

const { network } = require("hardhat");

async function main() {
  console.log("🚀 Starting local Hardhat network...");
  console.log("📡 Network URL: http://127.0.0.1:8545");
  console.log("🔗 Chain ID: 31337");
  console.log("💰 Accounts with 10000 ETH each will be created automatically");
  console.log("");
  console.log("🔧 To connect MetaMask:");
  console.log("   1. Add custom network: http://127.0.0.1:8545");
  console.log("   2. Chain ID: 31337");
  console.log("   3. Currency Symbol: ETH");
  console.log("");
  console.log("📝 To deploy contracts:");
  console.log("   npx hardhat run scripts/deploy.js --network localhost");
  console.log("");
  console.log("🛑 Press Ctrl+C to stop the network");
  console.log("=" * 50);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error starting network:", error);
    process.exit(1);
  });

/**
 * Start Local Hardhat Network
 * 
 * This script starts a local Hardhat network that can be used by external clients
 * like MetaMask or your frontend application.
 * 
 * Usage:
 *   node scripts/start-local-network.js
 *   or
 *   npx hardhat node
 */

const { network } = require("hardhat");

async function main() {
  console.log("🚀 Starting local Hardhat network...");
  console.log("📡 Network URL: http://127.0.0.1:8545");
  console.log("🔗 Chain ID: 31337");
  console.log("💰 Accounts with 10000 ETH each will be created automatically");
  console.log("");
  console.log("🔧 To connect MetaMask:");
  console.log("   1. Add custom network: http://127.0.0.1:8545");
  console.log("   2. Chain ID: 31337");
  console.log("   3. Currency Symbol: ETH");
  console.log("");
  console.log("📝 To deploy contracts:");
  console.log("   npx hardhat run scripts/deploy.js --network localhost");
  console.log("");
  console.log("🛑 Press Ctrl+C to stop the network");
  console.log("=" * 50);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error starting network:", error);
    process.exit(1);
  });

/**
 * Start Local Hardhat Network
 * 
 * This script starts a local Hardhat network that can be used by external clients
 * like MetaMask or your frontend application.
 * 
 * Usage:
 *   node scripts/start-local-network.js
 *   or
 *   npx hardhat node
 */

const { network } = require("hardhat");

async function main() {
  console.log("🚀 Starting local Hardhat network...");
  console.log("📡 Network URL: http://127.0.0.1:8545");
  console.log("🔗 Chain ID: 31337");
  console.log("💰 Accounts with 10000 ETH each will be created automatically");
  console.log("");
  console.log("🔧 To connect MetaMask:");
  console.log("   1. Add custom network: http://127.0.0.1:8545");
  console.log("   2. Chain ID: 31337");
  console.log("   3. Currency Symbol: ETH");
  console.log("");
  console.log("📝 To deploy contracts:");
  console.log("   npx hardhat run scripts/deploy.js --network localhost");
  console.log("");
  console.log("🛑 Press Ctrl+C to stop the network");
  console.log("=" * 50);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error starting network:", error);
    process.exit(1);
  });

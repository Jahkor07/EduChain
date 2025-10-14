require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.18" }, // your original
      { version: "0.8.19" }, // matches EduChainNFT.sol
      { version: "0.8.20" }, // matches most OpenZeppelin contracts
      { version: "0.8.28" }, // matches Lock.sol
    ],
  },
  networks: {
    hardhat: { chainId: 31337 },
    localhost: { url: "http://127.0.0.1:8545", chainId: 31337 },
    sepolia: {
      url: process.env.ETHEREUM_NETWORK_URL || "https://sepolia.infura.io/v3/your_project_id",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
    }
  },
  etherscan: { apiKey: process.env.ETHERSCAN_API_KEY || "" },
  gasReporter: { enabled: process.env.REPORT_GAS !== undefined, currency: "USD" },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};

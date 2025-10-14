// Smart Contract Configuration for EduChain NFT
const { ethers } = require('ethers');

// EduChain NFT Contract ABI (simplified for minting)
const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "tokenURI",
        "type": "string"
      }
    ],
    "name": "mintNFT",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tokenIdCounter",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Contract configuration
const CONTRACT_CONFIG = {
  // For development - replace with actual deployed contract address
  CONTRACT_ADDRESS: process.env.NFT_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000",
  
  // Network configuration
  NETWORK: {
    name: process.env.NETWORK_NAME || "sepolia",
    chainId: process.env.CHAIN_ID || 11155111,
    rpcUrl: process.env.RPC_URL || "https://sepolia.infura.io/v3/YOUR_PROJECT_ID"
  },
  
  // Gas configuration
  GAS_LIMIT: 500000,
  GAS_PRICE: ethers.parseUnits("20", "gwei")
};

// Initialize provider and contract
const getProvider = () => {
  return new ethers.JsonRpcProvider(CONTRACT_CONFIG.NETWORK.rpcUrl);
};

const getContract = (signer) => {
  const provider = getProvider();
  const contractSigner = signer || provider;
  return new ethers.Contract(
    CONTRACT_CONFIG.CONTRACT_ADDRESS,
    CONTRACT_ABI,
    contractSigner
  );
};

module.exports = {
  CONTRACT_ABI,
  CONTRACT_CONFIG,
  getProvider,
  getContract
};








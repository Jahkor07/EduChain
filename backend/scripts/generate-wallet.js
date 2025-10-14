const { ethers } = require('ethers');

async function generateWallet() {
  console.log('🔑 Generating Test Wallet...\n');
  
  // Generate a new random wallet
  const wallet = ethers.Wallet.createRandom();
  
  console.log('✅ Test Wallet Generated Successfully!\n');
  console.log('📋 Wallet Details:');
  console.log('📍 Address:', wallet.address);
  console.log('🔑 Private Key:', wallet.privateKey);
  console.log('📝 Mnemonic:', wallet.mnemonic.phrase);
  
  console.log('\n💡 Next Steps:');
  console.log('1. Copy the private key above');
  console.log('2. Update your .env file with PRIVATE_KEY=' + wallet.privateKey);
  console.log('3. Get some test ETH for this address');
  console.log('4. Deploy your smart contract!');
  
  console.log('\n⚠️  IMPORTANT: This is a TEST wallet only!');
  console.log('   Never use this private key for real funds!');
  
  return wallet;
}

// Run the wallet generation
generateWallet().catch(console.error);





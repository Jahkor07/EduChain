const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

class PinataService {
  constructor() {
    this.apiKey = process.env.PINATA_API_KEY;
    this.secretKey = process.env.PINATA_SECRET_KEY;
    this.baseURL = 'https://api.pinata.cloud';
  }

  // Upload file to IPFS via Pinata
  async uploadFile(fileBuffer, fileName) {
    try {
      const formData = new FormData();
      formData.append('file', fileBuffer, {
        filename: fileName,
        contentType: this.getContentType(fileName)
      });

      const response = await axios.post(`${this.baseURL}/pinning/pinFileToIPFS`, formData, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          ...formData.getHeaders()
        }
      });

      console.log('File uploaded to IPFS:', response.data.IpfsHash);
      return {
        ipfsHash: response.data.IpfsHash,
        ipfsUrl: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
      };
    } catch (error) {
      console.error('Error uploading file to Pinata:', error.response?.data || error.message);
      throw new Error(`Failed to upload file to IPFS: ${error.message}`);
    }
  }

  // Upload JSON metadata to IPFS
  async uploadMetadata(metadata) {
    try {
      const response = await axios.post(`${this.baseURL}/pinning/pinJSONToIPFS`, metadata, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Metadata uploaded to IPFS:', response.data.IpfsHash);
      return {
        ipfsHash: response.data.IpfsHash,
        ipfsUrl: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
      };
    } catch (error) {
      console.error('Error uploading metadata to Pinata:', error.response?.data || error.message);
      throw new Error(`Failed to upload metadata to IPFS: ${error.message}`);
    }
  }

  // Get content type based on file extension
  getContentType(fileName) {
    const ext = fileName.toLowerCase().split('.').pop();
    const contentTypes = {
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'svg': 'image/svg+xml',
      'pdf': 'application/pdf',
      'json': 'application/json'
    };
    return contentTypes[ext] || 'application/octet-stream';
  }

  // Create NFT metadata object
  createNFTMetadata(name, description, imageUrl, attributes = []) {
    return {
      name: name,
      description: description,
      image: imageUrl,
      attributes: attributes,
      external_url: "https://educhain.com",
      animation_url: "",
      background_color: "",
      youtube_url: ""
    };
  }

  // Test Pinata connection
  async testConnection() {
    try {
      const response = await axios.get(`${this.baseURL}/data/testAuthentication`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      return response.data.message === 'Congratulations! You are communicating with the Pinata API!';
    } catch (error) {
      console.error('Pinata connection test failed:', error.message);
      return false;
    }
  }
}

module.exports = new PinataService();






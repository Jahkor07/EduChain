// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

contract EduChainNFT is ERC721URIStorage, ERC2981, Ownable {
    uint256 private _tokenIdCounter;
    uint96 public defaultRoyaltyBPS; // Default royalty in basis points (100 = 1%)
    address public defaultRoyaltyReceiver;

    event NFTMinted(
        uint256 indexed tokenId,
        address indexed to,
        string tokenURI,
        address royaltyReceiver,
        uint96 royaltyBPS
    );

    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {
        // Set default royalty to 5% (500 basis points) for the contract owner
        defaultRoyaltyBPS = 500;
        defaultRoyaltyReceiver = msg.sender;
        _setDefaultRoyalty(msg.sender, defaultRoyaltyBPS);
    }

    function supportsInterface(bytes4 interfaceId) 
        public 
        view 
        virtual 
        override(ERC721, ERC2981) 
        returns (bool) 
    {
        return super.supportsInterface(interfaceId);
    }

    function safeMint(
        address to, 
        string memory tokenURI,
        address royaltyReceiver, 
        uint96 royaltyBPS
    ) external onlyOwner returns (uint256) {
        _tokenIdCounter++;
        uint256 newId = _tokenIdCounter;
        _safeMint(to, newId);
        _setTokenURI(newId, tokenURI);
        
        // Set individual token royalty if provided, otherwise use default
        if (royaltyReceiver != address(0) && royaltyBPS > 0) {
            _setTokenRoyalty(newId, royaltyReceiver, royaltyBPS);
        } else {
            // Use default royalty settings
            _setTokenRoyalty(newId, defaultRoyaltyReceiver, defaultRoyaltyBPS);
        }
        
        emit NFTMinted(newId, to, tokenURI, royaltyReceiver, royaltyBPS);
        return newId;
    }

    // Allow owner to set default royalty for future tokens
    function setDefaultRoyalty(address receiver, uint96 feeNumerator) external onlyOwner {
        require(receiver != address(0), "Royalty receiver cannot be zero address");
        require(feeNumerator <= 1000, "Royalty cannot exceed 10%"); // Max 10%
        
        defaultRoyaltyReceiver = receiver;
        defaultRoyaltyBPS = feeNumerator;
        _setDefaultRoyalty(receiver, feeNumerator);
    }

    function deleteDefaultRoyalty() external onlyOwner {
        _deleteDefaultRoyalty();
        defaultRoyaltyBPS = 0;
        defaultRoyaltyReceiver = address(0);
    }

    // Set royalty for a specific token
    function setTokenRoyalty(
        uint256 tokenId, 
        address receiver, 
        uint96 feeNumerator
    ) external onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        require(receiver != address(0), "Royalty receiver cannot be zero address");
        require(feeNumerator <= 1000, "Royalty cannot exceed 10%");
        
        _setTokenRoyalty(tokenId, receiver, feeNumerator);
    }

    // Withdraw contract funds
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        payable(owner()).transfer(balance);
    }

    // Get total supply
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter;
    }

    // Get token ID counter
    function getTokenIdCounter() external view returns (uint256) {
        return _tokenIdCounter;
    }

    // Check if token exists
    function exists(uint256 tokenId) external view returns (bool) {
        return _exists(tokenId);
    }

    // Get royalty info for a token
    function getTokenRoyalty(uint256 tokenId) external view returns (address, uint96) {
        return royaltyInfo(tokenId, 10000); // 10000 is the denominator for basis points
    }

    // Emergency function to transfer ownership
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        _transferOwnership(newOwner);
    }

    // Receive function to accept ETH
    receive() external payable {}
}
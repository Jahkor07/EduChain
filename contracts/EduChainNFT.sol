// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

contract EduChainNFT is ERC721URIStorage, ERC2981, Ownable {
    uint256 public tokenCounter;
    uint96 public defaultRoyaltyFee = 1000; // 10% (1000 = 10.00%)
    
    // Mapping to track educator ownership of content
    mapping(uint256 => address) public contentCreator;
    mapping(uint256 => string) public contentType; // "course" or "certificate"
    
    // Events for tracking
    event ContentMinted(uint256 indexed tokenId, address indexed creator, string contentType, string tokenURI);
    event RoyaltyUpdated(uint256 indexed tokenId, address indexed receiver, uint96 fee);

    constructor() ERC721("EduChainNFT", "EDU") Ownable(msg.sender) {
        tokenCounter = 0;
    }

    function mintCourseNFT(
        address recipient,
        string memory tokenURI,
        address educator
    ) public onlyOwner returns (uint256) {
        uint256 newItemId = tokenCounter;
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        
        // Set educator as royalty receiver with 10% fee
        _setTokenRoyalty(newItemId, educator, defaultRoyaltyFee);
        
        // Track content creator and type
        contentCreator[newItemId] = educator;
        contentType[newItemId] = "course";
        
        tokenCounter++;
        
        emit ContentMinted(newItemId, educator, "course", tokenURI);
        emit RoyaltyUpdated(newItemId, educator, defaultRoyaltyFee);
        
        return newItemId;
    }

    function mintCertificateNFT(
        address recipient,
        string memory tokenURI,
        address educator
    ) public onlyOwner returns (uint256) {
        uint256 newItemId = tokenCounter;
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        
        // Set educator as royalty receiver with 10% fee
        _setTokenRoyalty(newItemId, educator, defaultRoyaltyFee);
        
        // Track content creator and type
        contentCreator[newItemId] = educator;
        contentType[newItemId] = "certificate";
        
        tokenCounter++;
        
        emit ContentMinted(newItemId, educator, "certificate", tokenURI);
        emit RoyaltyUpdated(newItemId, educator, defaultRoyaltyFee);
        
        return newItemId;
    }

    // Legacy mint function for backward compatibility
    function mintNFT(
        address recipient,
        string memory tokenURI,
        address royaltyReceiver,
        uint96 royaltyFee
    ) public onlyOwner returns (uint256) {
        uint256 newItemId = tokenCounter;
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        _setTokenRoyalty(newItemId, royaltyReceiver, royaltyFee);
        tokenCounter++;
        return newItemId;
    }

    // Function to get royalty info for a specific token
    function getRoyaltyInfo(uint256 tokenId, uint256 salePrice) 
        public 
        view 
        returns (address receiver, uint256 royaltyAmount) 
    {
        return royaltyInfo(tokenId, salePrice);
    }

    // Function to calculate royalty for a given sale price
    function calculateRoyalty(uint256 tokenId, uint256 salePrice) 
        public 
        view 
        returns (uint256) 
    {
        (address receiver, uint256 royaltyAmount) = royaltyInfo(tokenId, salePrice);
        return royaltyAmount;
    }

    // Function to verify educator ownership of content
    function isContentCreator(uint256 tokenId, address educator) 
        public 
        view 
        returns (bool) 
    {
        return contentCreator[tokenId] == educator;
    }

    // Function to get content type
    function getContentType(uint256 tokenId) 
        public 
        view 
        returns (string memory) 
    {
        return contentType[tokenId];
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721URIStorage, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

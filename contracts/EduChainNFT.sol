// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

contract EduChainNFT is ERC721URIStorage, ERC2981, Ownable {
    uint256 public tokenCounter;

    constructor() ERC721("EduChainNFT", "EDU") Ownable(msg.sender) {
        tokenCounter = 0;
    }

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

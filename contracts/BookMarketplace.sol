// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract BookMarketplace is Ownable, ReentrancyGuard {
    struct Book {
        uint256 id;
        string title;
        string author;
        string description;
        string imageUrl;
        uint256 price; // Price in wei
        address educator;
        address owner;
        bool exists;
        uint256 createdAt;
    }

    mapping(uint256 => Book) public books;
    mapping(address => uint256[]) public userBooks;
    uint256 public bookCounter;
    
    event BookAdded(uint256 indexed bookId, string title, address indexed educator);
    event BookPurchased(uint256 indexed bookId, address indexed buyer, address indexed educator, uint256 price);

    constructor() {}

    // Add a new book to the marketplace
    function addBook(
        string memory _title,
        string memory _author,
        string memory _description,
        string memory _imageUrl,
        uint256 _price
    ) external returns (uint256) {
        bookCounter++;
        uint256 bookId = bookCounter;
        
        books[bookId] = Book({
            id: bookId,
            title: _title,
            author: _author,
            description: _description,
            imageUrl: _imageUrl,
            price: _price,
            educator: msg.sender,
            owner: address(0), // No owner initially
            exists: true,
            createdAt: block.timestamp
        });
        
        emit BookAdded(bookId, _title, msg.sender);
        return bookId;
    }

    // Buy a book and transfer ETH to educator
    function buyBook(uint256 bookId) external payable nonReentrant {
        Book storage book = books[bookId];
        require(book.exists, "Book does not exist");
        require(msg.value >= book.price, "Insufficient funds");
        require(book.owner == address(0), "Book already sold");
        
        // Transfer ownership to buyer
        book.owner = msg.sender;
        
        // Add book to buyer's collection
        userBooks[msg.sender].push(bookId);
        
        // Transfer ETH to educator
        payable(book.educator).transfer(msg.value);
        
        emit BookPurchased(bookId, msg.sender, book.educator, msg.value);
    }

    // Get book details
    function getBook(uint256 bookId) external view returns (Book memory) {
        require(books[bookId].exists, "Book does not exist");
        return books[bookId];
    }

    // Get all books (for marketplace display)
    function getAllBooks() external view returns (Book[] memory) {
        Book[] memory allBooks = new Book[](bookCounter);
        for (uint256 i = 1; i <= bookCounter; i++) {
            if (books[i].exists) {
                allBooks[i - 1] = books[i];
            }
        }
        return allBooks;
    }

    // Get user's purchased books
    function getUserBooks(address user) external view returns (uint256[] memory) {
        return userBooks[user];
    }

    // Check if user owns a book
    function ownsBook(address user, uint256 bookId) external view returns (bool) {
        return books[bookId].owner == user;
    }

    // Get book price
    function getBookPrice(uint256 bookId) external view returns (uint256) {
        require(books[bookId].exists, "Book does not exist");
        return books[bookId].price;
    }

    // Check if book exists
    function bookExists(uint256 bookId) external view returns (bool) {
        return books[bookId].exists;
    }

    // Emergency function to withdraw contract balance (only owner)
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // Receive ETH
    receive() external payable {}
}


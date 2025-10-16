const express = require('express');
const axios = require('axios');
const Book = require('../models/Book');
const User = require('../models/User');
const Certificate = require('../models/Certificate');
const { auth } = require('../middleware/auth');
const { requireEducator } = require('../middleware/roleCheck');

const router = express.Router();

// Search books using Google Books API
router.get('/search-books', auth, requireEducator, async (req, res) => {
  try {
    const { q: searchQuery, maxResults = 20 } = req.query;
    
    if (!searchQuery || searchQuery.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required and must be at least 2 characters long'
      });
    }

    console.log(`Educator ${req.user.id} searching for books: "${searchQuery}"`);

    // Call Google Books API
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&key=${process.env.GOOGLE_BOOKS_API_KEY}&maxResults=${maxResults}&orderBy=relevance`
    );

    // Transform the response to include only necessary fields
    const books = (response.data.items || []).map(book => {
      const volumeInfo = book.volumeInfo || {};
      const saleInfo = book.saleInfo || {};
      
      return {
        googleBooksId: book.id,
        title: volumeInfo.title || 'Unknown Title',
        authors: volumeInfo.authors || [],
        description: volumeInfo.description || '',
        thumbnail: volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail || '',
        publisher: volumeInfo.publisher || '',
        publishedDate: volumeInfo.publishedDate || '',
        pageCount: volumeInfo.pageCount || 0,
        language: volumeInfo.language || 'en',
        categories: volumeInfo.categories || [],
        averageRating: volumeInfo.averageRating || 0,
        ratingsCount: volumeInfo.ratingsCount || 0,
        previewLink: volumeInfo.previewLink || '',
        infoLink: volumeInfo.infoLink || '',
        listPrice: saleInfo.listPrice || null,
        retailPrice: saleInfo.retailPrice || null,
        buyLink: saleInfo.buyLink || ''
      };
    });

    res.json({
      success: true,
      data: books,
      count: books.length,
      query: searchQuery
    });

  } catch (error) {
    console.error('Google Books API error:', error.message);
    
    // Return error response
    res.status(500).json({
      success: false,
      error: 'Failed to search books',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Add a book to the marketplace
router.post('/add-book', auth, requireEducator, async (req, res) => {
  try {
    const {
      googleBooksId,
      title,
      authors,
      description,
      thumbnail,
      publisher,
      publishedDate,
      pageCount,
      language,
      categories,
      averageRating,
      ratingsCount,
      previewLink,
      infoLink,
      educatorPrice,
      currency = 'USD'
    } = req.body;

    // Validate required fields
    if (!googleBooksId || !title || !educatorPrice) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: googleBooksId, title, and educatorPrice are required'
      });
    }

    if (educatorPrice <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Educator price must be greater than 0'
      });
    }

    // Check if book already exists for this educator
    const existingBook = await Book.findOne({
      googleBooksId,
      educatorId: req.user.id
    });

    if (existingBook) {
      return res.status(409).json({
        success: false,
        error: 'This book has already been added to your marketplace'
      });
    }

    // Create new book entry
    const book = new Book({
      googleBooksId,
      title,
      authors: authors || [],
      description: description || '',
      thumbnail: thumbnail || '',
      publisher: publisher || '',
      publishedDate: publishedDate || '',
      pageCount: pageCount || 0,
      language: language || 'en',
      categories: categories || [],
      averageRating: averageRating || 0,
      ratingsCount: ratingsCount || 0,
      previewLink: previewLink || '',
      infoLink: infoLink || '',
      educatorId: req.user.id,
      educatorPrice,
      currency
    });

    await book.save();

    console.log(`✅ Educator ${req.user.id} added book: "${title}" with price $${educatorPrice}`);
    console.log(`📚 Book ID: ${book._id} - Now available in educator's "My Books" section`);

    // Return complete book data for immediate display in My Books
    res.status(201).json({
      success: true,
      message: 'Book successfully added to marketplace and My Books',
      data: {
        _id: book._id,
        id: book._id,
        googleBooksId: book.googleBooksId,
        title: book.title,
        authors: book.authors,
        description: book.description,
        thumbnail: book.thumbnail,
        publisher: book.publisher,
        publishedDate: book.publishedDate,
        pageCount: book.pageCount,
        language: book.language,
        categories: book.categories,
        averageRating: book.averageRating,
        ratingsCount: book.ratingsCount,
        previewLink: book.previewLink,
        infoLink: book.infoLink,
        educatorId: book.educatorId,
        educatorPrice: book.educatorPrice,
        currency: book.currency,
        isActive: book.isActive,
        addedAt: book.addedAt,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt
      }
    });

  } catch (error) {
    console.error('Error adding book:', error.message);
    
    res.status(500).json({
      success: false,
      error: 'Failed to add book to marketplace',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get educator's added books
router.get('/my-books', auth, requireEducator, async (req, res) => {
  try {
    const { page = 1, limit = 10, isActive } = req.query;
    const skip = (page - 1) * limit;

    const query = { educatorId: req.user.id };
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const books = await Book.find(query)
      .sort({ addedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('educatorId', 'username email');

    const total = await Book.countDocuments(query);

    res.json({
      success: true,
      data: books,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalBooks: total,
        hasNext: skip + books.length < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching educator books:', error.message);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch books',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Update book details
router.put('/books/:bookId', auth, requireEducator, async (req, res) => {
  try {
    const { bookId } = req.params;
    const { educatorPrice, currency, isActive } = req.body;

    const book = await Book.findOne({
      _id: bookId,
      educatorId: req.user.id
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found or you do not have permission to update it'
      });
    }

    // Update allowed fields
    if (educatorPrice !== undefined) {
      if (educatorPrice <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Educator price must be greater than 0'
        });
      }
      book.educatorPrice = educatorPrice;
    }

    if (currency !== undefined) {
      book.currency = currency;
    }

    if (isActive !== undefined) {
      book.isActive = isActive;
    }

    await book.save();

    res.json({
      success: true,
      message: 'Book updated successfully',
      data: {
        id: book._id,
        title: book.title,
        educatorPrice: book.educatorPrice,
        currency: book.currency,
        isActive: book.isActive,
        updatedAt: book.updatedAt
      }
    });

  } catch (error) {
    console.error('Error updating book:', error.message);
    
    res.status(500).json({
      success: false,
      error: 'Failed to update book',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Delete book from marketplace
router.delete('/books/:bookId', auth, requireEducator, async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findOne({
      _id: bookId,
      educatorId: req.user.id
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found or you do not have permission to delete it'
      });
    }

    await Book.findByIdAndDelete(bookId);

    res.json({
      success: true,
      message: 'Book successfully removed from marketplace'
    });

  } catch (error) {
    console.error('Error deleting book:', error.message);
    
    res.status(500).json({
      success: false,
      error: 'Failed to delete book',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Dashboard stats endpoint
router.get('/dashboard/stats', auth, requireEducator, async (req, res) => {
  try {
    const educatorId = req.user.id;
    
    // Get total students (users with role 'student')
    const totalStudents = await User.countDocuments({ role: 'student' });
    
    // Get books uploaded by this educator
    const booksUploaded = await Book.countDocuments({ educatorId });
    
    // Get certificates minted by this educator
    const certificatesMinted = await Certificate.countDocuments({ educatorId });
    
    // Get active educators count
    const activeEducators = await User.countDocuments({ role: 'educator' });
    
    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentBooks = await Book.countDocuments({ 
      educatorId, 
      createdAt: { $gte: thirtyDaysAgo } 
    });
    
    const recentCertificates = await Certificate.countDocuments({ 
      educatorId, 
      issuedAt: { $gte: thirtyDaysAgo } 
    });
    
    // Get educator's books with quantity info
    const educatorBooks = await Book.find({ educatorId }).select('title quantity educatorPrice');
    
    // Calculate total revenue (mock calculation based on books sold)
    const totalRevenue = educatorBooks.reduce((sum, book) => {
      const sold = (book.quantity || 10) - (book.currentQuantity || 0);
      return sum + (sold * (book.educatorPrice || 0));
    }, 0);
    
    const stats = {
      totalStudents,
      booksUploaded,
      certificatesMinted,
      activeEducators,
      recentActivity: {
        booksAdded: recentBooks,
        certificatesIssued: recentCertificates
      },
      revenue: {
        total: totalRevenue,
        currency: 'ZMW'
      },
      lastUpdated: new Date().toISOString()
    };
    
    console.log(`Dashboard stats fetched for educator ${educatorId}:`, stats);
    
    res.json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    console.error('Error fetching dashboard stats:', error.message);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard statistics',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Educator transactions endpoint
router.get('/transactions', auth, requireEducator, async (req, res) => {
  try {
    const educatorId = req.user.id;
    
    // In a real implementation, you would fetch from a transactions collection
    // For now, we'll return mock data based on the educator's books
    const educatorBooks = await Book.find({ educatorId }).select('title educatorPrice');
    
    // Mock transaction data based on books
    const mockTransactions = educatorBooks.map((book, index) => ({
      id: `tx-edu-${educatorId}-${index + 1}`,
      type: 'book_sale',
      studentEmail: `student${index + 1}@example.com`,
      bookTitle: book.title,
      amount: book.educatorPrice || 10,
      currency: 'ZMW',
      paymentMethod: index % 2 === 0 ? 'MetaMask' : 'Stripe',
      status: index % 3 === 0 ? 'pending' : 'completed',
      transactionHash: index % 3 === 0 ? null : `0x${Math.random().toString(16).substr(2, 8)}`,
      timestamp: new Date(Date.now() - (index * 86400000)).toISOString(),
      educatorWallet: '0x' + Math.random().toString(16).substr(2, 8)
    }));
    
    res.json({
      success: true,
      data: mockTransactions
    });
    
  } catch (error) {
    console.error('Error fetching educator transactions:', error.message);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch educator transactions',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Educator revenue endpoint
router.get('/revenue', auth, requireEducator, async (req, res) => {
  try {
    const educatorId = req.user.id;
    
    // Get educator's books
    const educatorBooks = await Book.find({ educatorId }).select('title educatorPrice quantity');
    
    // Calculate total revenue (mock calculation)
    const totalRevenue = educatorBooks.reduce((sum, book) => {
      const sold = Math.floor((book.quantity || 10) * 0.7); // Assume 70% sold
      return sum + (sold * (book.educatorPrice || 10));
    }, 0);
    
    // Calculate pending payments (mock calculation)
    const pendingPayments = educatorBooks.reduce((sum, book) => {
      const pending = Math.floor((book.quantity || 10) * 0.1); // Assume 10% pending
      return sum + (pending * (book.educatorPrice || 10));
    }, 0);
    
    res.json({
      success: true,
      data: {
        totalRevenue,
        pendingPayments,
        currency: 'ZMW',
        lastUpdated: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error fetching educator revenue:', error.message);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch educator revenue',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;

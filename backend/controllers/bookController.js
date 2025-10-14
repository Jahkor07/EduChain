import Book from '../models/Book.js';

// Add a new book to the marketplace
export const addBook = async (req, res) => {
  try {
    const { title, authors, description, thumbnail, publisher, publishedDate, pageCount, language, categories, educatorPrice, currency } = req.body;
    
    // Validate required fields
    if (!title || !authors || !description || !thumbnail) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, authors, description, and thumbnail are required'
      });
    }

    // Get educator ID from authenticated user
    const educatorId = req.user.id;

    // Create a unique Google Books ID for educator-added books
    const googleBooksId = `educator_${educatorId}_${Date.now()}`;

    // Create new book
    const newBook = new Book({
      googleBooksId,
      title,
      authors: Array.isArray(authors) ? authors : [authors],
      description,
      thumbnail,
      publisher: publisher || '',
      publishedDate: publishedDate || '',
      pageCount: pageCount || 0,
      language: language || 'en',
      categories: categories || [],
      educatorId,
      educatorPrice: educatorPrice || 0,
      currency: currency || 'ZMW',
      isActive: true
    });

    // Save to database
    const savedBook = await newBook.save();

    // Populate educator information
    await savedBook.populate('educatorId', 'firstName lastName email');

    res.status(201).json({
      success: true,
      message: 'Book added to marketplace successfully',
      data: savedBook
    });

  } catch (error) {
    console.error('Error adding book:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Book already exists in the marketplace'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get all books from the marketplace
export const getBooks = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category, educatorId } = req.query;
    
    // Build query
    const query = { isActive: true };
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (category) {
      query.categories = { $in: [category] };
    }
    
    if (educatorId) {
      query.educatorId = educatorId;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const books = await Book.find(query)
      .populate('educatorId', 'firstName lastName email')
      .sort({ addedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Book.countDocuments(query);

    res.json({
      success: true,
      data: books,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get a single book by ID
export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const book = await Book.findById(id)
      .populate('educatorId', 'firstName lastName email');
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.json({
      success: true,
      data: book
    });

  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update a book (only by the educator who added it)
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const educatorId = req.user.id;
    const updateData = req.body;

    // Find the book and verify ownership
    const book = await Book.findById(id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    if (book.educatorId.toString() !== educatorId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update books you added'
      });
    }

    // Update the book
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('educatorId', 'firstName lastName email');

    res.json({
      success: true,
      message: 'Book updated successfully',
      data: updatedBook
    });

  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete a book (only by the educator who added it)
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const educatorId = req.user.id;

    // Find the book and verify ownership
    const book = await Book.findById(id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    if (book.educatorId.toString() !== educatorId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete books you added'
      });
    }

    // Soft delete by setting isActive to false
    await Book.findByIdAndUpdate(id, { isActive: false });

    res.json({
      success: true,
      message: 'Book removed from marketplace successfully'
    });

  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};



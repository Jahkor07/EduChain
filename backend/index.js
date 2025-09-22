const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Increase JSON body size limit to handle base64 encoded files
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/educhain', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Import routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const certificateRoutes = require('./routes/certificates');
const notificationRoutes = require('./routes/notifications');
const freeCoursesRoutes = require('./routes/freecourses');
const nftRoutes = require('./routes/nft');
const educatorRoutes = require('./routes/educator');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api', freeCoursesRoutes);
app.use('/api/nft', nftRoutes);
app.use('/api/educator', educatorRoutes);

// Google Books API route
app.get("/api/books", async (req, res) => {
  const { query } = req.query;
  console.log("Books API called with query:", query);
  console.log("Google Books API Key:", process.env.GOOGLE_BOOKS_API_KEY ? "Present" : "Missing");
  
  if (!query || query.trim().length < 2) {
    return res.status(400).json({ 
      success: false, 
      error: "Query parameter is required and must be at least 2 characters long" 
    });
  }
  
  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${process.env.GOOGLE_BOOKS_API_KEY}&maxResults=20&orderBy=relevance`
    );
    console.log("Google Books API response:", response.data.items?.length || 0, "books found");
    
    // Transform the response to include additional metadata
    const books = (response.data.items || []).map(book => ({
      ...book,
      // Add educator pricing if available (this would come from a database in a real app)
      educatorPrice: null, // This would be fetched from a books_pricing table
      isEducatorAdded: false // This would be checked against a books_educators table
    }));
    
    res.json({
      success: true,
      data: books,
      count: books.length,
      query: query
    });
  } catch (error) {
    console.error("Google Books API error:", error.message);
    console.error("Full error:", error.response?.data || error);
    
    // Fallback to mock data when API fails
    console.log("Falling back to mock book data...");
    const mockBooks = getMockBooks(query);
    res.json({
      success: true,
      data: mockBooks,
      count: mockBooks.length,
      query: query,
      fallback: true
    });
  }
});

// Mock books data function
function getMockBooks(query) {
  const allBooks = [
    {
      id: "mock-book-1",
      volumeInfo: {
        title: "JavaScript: The Definitive Guide",
        authors: ["David Flanagan"],
        description: "The definitive guide to JavaScript, covering everything from basic syntax to advanced features.",
        imageLinks: {
          thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop&crop=center"
        },
        publishedDate: "2020-06-01",
        pageCount: 1096,
        language: "en",
        categories: ["Programming", "JavaScript"],
        averageRating: 4.5,
        ratingsCount: 1250
      },
      saleInfo: {
        listPrice: {
          amount: 59.99,
          currencyCode: "USD"
        }
      }
    },
    {
      id: "mock-book-2",
      volumeInfo: {
        title: "React: Up & Running",
        authors: ["Stoyan Stefanov"],
        description: "Learn React fundamentals and build modern web applications with this comprehensive guide.",
        imageLinks: {
          thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop&crop=center"
        },
        publishedDate: "2021-03-15",
        pageCount: 432,
        language: "en",
        categories: ["Programming", "React", "JavaScript"],
        averageRating: 4.3,
        ratingsCount: 890
      },
      saleInfo: {
        listPrice: {
          amount: 39.99,
          currencyCode: "USD"
        }
      }
    },
    {
      id: "mock-book-3",
      volumeInfo: {
        title: "Node.js Design Patterns",
        authors: ["Mario Casciaro", "Luciano Mammino"],
        description: "Master Node.js design patterns and best practices for building scalable applications.",
        imageLinks: {
          thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&crop=center"
        },
        publishedDate: "2020-11-20",
        pageCount: 568,
        language: "en",
        categories: ["Programming", "Node.js", "Backend"],
        averageRating: 4.7,
        ratingsCount: 654
      },
      saleInfo: {
        listPrice: {
          amount: 49.99,
          currencyCode: "USD"
        }
      }
    },
    {
      id: "mock-book-4",
      volumeInfo: {
        title: "Python Crash Course",
        authors: ["Eric Matthes"],
        description: "A hands-on, project-based introduction to programming with Python.",
        imageLinks: {
          thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop&crop=center"
        },
        publishedDate: "2019-05-01",
        pageCount: 544,
        language: "en",
        categories: ["Programming", "Python", "Beginner"],
        averageRating: 4.6,
        ratingsCount: 2100
      },
      saleInfo: {
        listPrice: {
          amount: 34.99,
          currencyCode: "USD"
        }
      }
    },
    {
      id: "mock-book-5",
      volumeInfo: {
        title: "Clean Code",
        authors: ["Robert C. Martin"],
        description: "A Handbook of Agile Software Craftsmanship - learn to write clean, maintainable code.",
        imageLinks: {
          thumbnail: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop&crop=center"
        },
        publishedDate: "2008-08-01",
        pageCount: 464,
        language: "en",
        categories: ["Programming", "Software Engineering", "Best Practices"],
        averageRating: 4.8,
        ratingsCount: 3200
      },
      saleInfo: {
        listPrice: {
          amount: 44.99,
          currencyCode: "USD"
        }
      }
    }
  ];
  
  // Filter books based on query
  if (query && query.toLowerCase() !== 'javascript') {
    return allBooks.filter(book => 
      book.volumeInfo.title.toLowerCase().includes(query.toLowerCase()) ||
      book.volumeInfo.authors.some(author => author.toLowerCase().includes(query.toLowerCase())) ||
      book.volumeInfo.description.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  return allBooks;
}

// Initialize blockchain service at startup
const blockchainService = require('./services/blockchainService');

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Initialize blockchain service
  console.log('🔗 Initializing blockchain service...');
  try {
    const blockchainInitialized = await blockchainService.initialize();
    if (blockchainInitialized) {
      console.log('✅ Blockchain service initialized successfully');
    } else {
      console.log('⚠️  Blockchain service initialization failed');
    }
  } catch (error) {
    console.error('❌ Blockchain service initialization error:', error.message);
  }
});
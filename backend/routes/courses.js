const express = require('express');
const Course = require('../models/Course');
const { authenticateToken, requireEducator, requireOwnership } = require('../middleware/roleCheck');

const router = express.Router();

// POST /courses - Create a new course (Educators only)
router.post('/', authenticateToken, requireEducator, async (req, res) => {
  try {
    const { title, description, price, duration, category, tags } = req.body;
    
    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ 
        error: 'Title and description are required' 
      });
    }

    // Create new course
    const newCourse = new Course({
      title,
      description,
      educatorId: req.user._id,
      educatorEmail: req.user.email,
      price: price || 0,
      currency: 'ZMW', // Always use Zambian Kwacha
      duration: duration || 'Self-paced',
      category: category || 'General',
      tags: tags || []
    });

    const savedCourse = await newCourse.save();
    
    console.log('Course created successfully:', savedCourse._id);

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: {
        id: savedCourse._id,
        title: savedCourse.title,
        description: savedCourse.description,
        educatorId: savedCourse.educatorId,
        educatorEmail: savedCourse.educatorEmail,
        price: savedCourse.price,
        currency: savedCourse.currency,
        duration: savedCourse.duration,
        category: savedCourse.category,
        tags: savedCourse.tags,
        status: savedCourse.status,
        createdAt: savedCourse.createdAt
      }
    });

  } catch (error) {
    console.error('Course creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create course',
      details: error.message 
    });
  }
});

// GET /courses - Get all courses (public)
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({ status: 'active' })
      .select('title description educatorEmail price duration category tags createdAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: courses
    });

  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ 
      error: 'Failed to fetch courses' 
    });
  }
});

// GET /courses/:id - Get specific course details
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .select('title description educatorEmail price duration category tags status createdAt');

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({
      success: true,
      data: course
    });

  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ 
      error: 'Failed to fetch course' 
    });
  }
});

// GET /courses/educator/me - Get courses for the current authenticated educator
router.get('/educator/me', authenticateToken, requireEducator, async (req, res) => {
  try {
    const courses = await Course.find({ 
      educatorId: req.user._id,
      status: { $in: ['active', 'inactive', 'draft'] }
    })
      .select('title description price duration category tags status createdAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: courses
    });

  } catch (error) {
    console.error('Error fetching educator courses:', error);
    res.status(500).json({ 
      error: 'Failed to fetch educator courses' 
    });
  }
});

// GET /courses/educator/:educatorId - Get courses by specific educator
router.get('/educator/:educatorId', async (req, res) => {
  try {
    const courses = await Course.find({ 
      educatorId: req.params.educatorId,
      status: 'active' 
    })
      .select('title description price duration category tags createdAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: courses
    });

  } catch (error) {
    console.error('Error fetching educator courses:', error);
    res.status(500).json({ 
      error: 'Failed to fetch educator courses' 
    });
  }
});

// PUT /courses/:id - Update course (Educator who owns the course only)
router.put('/:id', authenticateToken, requireEducator, requireOwnership('Course'), async (req, res) => {
  try {
    const { title, description, price, duration, category, tags, status } = req.body;
    
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (duration) updateData.duration = duration;
    if (category) updateData.category = category;
    if (tags) updateData.tags = tags;
    if (status) updateData.status = status;

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse
    });

  } catch (error) {
    console.error('Course update error:', error);
    res.status(500).json({ 
      error: 'Failed to update course' 
    });
  }
});

// DELETE /courses/:id - Delete course (Educator who owns the course only)
router.delete('/:id', authenticateToken, requireEducator, requireOwnership('Course'), async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Course deleted successfully'
    });

  } catch (error) {
    console.error('Course deletion error:', error);
    res.status(500).json({ 
      error: 'Failed to delete course' 
    });
  }
});

// POST /courses/:id/enroll - Enroll student in a course
router.post('/:id/enroll', authenticateToken, async (req, res) => {
  try {
    const courseId = req.params.id;
    const studentId = req.user._id;
    
    // Check if user is a student
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Only students can enroll in courses' });
    }

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if course is active
    if (course.status !== 'active') {
      return res.status(400).json({ error: 'Course is not available for enrollment' });
    }

    // Check if student is already enrolled
    if (course.enrolledStudents.includes(studentId)) {
      return res.status(400).json({ error: 'You are already enrolled in this course' });
    }

    // Add student to enrolled students
    course.enrolledStudents.push(studentId);
    await course.save();

    res.json({
      success: true,
      message: 'Successfully enrolled in course',
      data: {
        courseId: course._id,
        courseTitle: course.title,
        studentId: studentId,
        enrolledAt: new Date()
      }
    });

  } catch (error) {
    console.error('Course enrollment error:', error);
    res.status(500).json({ error: 'Failed to enroll in course' });
  }
});

// GET /courses/enrolled - Get courses where student is enrolled
router.get('/enrolled', authenticateToken, async (req, res) => {
  try {
    // Check if user is a student
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Only students can view enrolled courses' });
    }

    const enrolledCourses = await Course.find({
      enrolledStudents: req.user._id,
      status: 'active'
    }).select('title description price duration category tags createdAt');

    res.json({
      success: true,
      data: enrolledCourses
    });

  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({ error: 'Failed to fetch enrolled courses' });
  }
});

// POST /courses/:id/complete - Mark course as completed by student
router.post('/:id/complete', authenticateToken, async (req, res) => {
  try {
    const courseId = req.params.id;
    const studentId = req.user._id;
    
    // Check if user is a student
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Only students can mark courses as completed' });
    }

    // Find the course and check enrollment
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (!course.enrolledStudents.includes(studentId)) {
      return res.status(400).json({ error: 'You are not enrolled in this course' });
    }

    // Add to completed courses (you might want to create a separate model for this)
    // For now, we'll just return success
    res.json({
      success: true,
      message: 'Course marked as completed',
      data: {
        courseId: course._id,
        courseTitle: course.title,
        studentId: studentId,
        completedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Course completion error:', error);
    res.status(500).json({ error: 'Failed to mark course as completed' });
  }
});

module.exports = router;



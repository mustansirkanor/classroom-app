
// Get subject details by ID
// Get classroom details by ID

const { downloadFile, sendToSihApi, handleSihRequest } = require('../utils/sihHelpers');

const express = require('express');
const Classroom = require('../models/Classroom');
const Subject = require('../models/Subject');
const Material = require('../models/Material');
const Assignment = require('../models/Assignment');
const { auth, isTeacher } = require('../middleware/auth');
const { upload, uploadToCloudinary } = require('../middleware/upload');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');

const router = express.Router();

// Generate random class code
const generateClassCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Get teacher dashboard
router.get('/dashboard', auth, isTeacher, async (req, res) => {
  try {
    const classrooms = await Classroom.find({ teacherId: req.user._id })
      .populate('students', 'name email');

    const totalStudents = classrooms.reduce((total, classroom) => {
      return total + classroom.students.length;
    }, 0);

    const totalSubjects = await Subject.countDocuments({ teacherId: req.user._id });
    const totalMaterials = await Material.countDocuments({ teacherId: req.user._id });
    const totalAssignments = await Assignment.countDocuments({ teacherId: req.user._id });

    res.json({
      classrooms,
      stats: {
        totalClassrooms: classrooms.length,
        totalStudents,
        totalSubjects,
        totalMaterials,
        totalAssignments
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/subject/:subjectId', auth, isTeacher, async (req, res) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.subjectId, teacherId: req.user._id })
      .populate('materials')
      .populate('assignments');
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found or access denied' });
    }
    res.json(subject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Create new classroom
router.post('/classroom', auth, isTeacher, async (req, res) => {
  try {
    const { name, description } = req.body;

    let classCode;
    let existingClassroom;
    
    // Generate unique class code
    do {
      classCode = generateClassCode();
      existingClassroom = await Classroom.findOne({ classCode });
    } while (existingClassroom);

    const classroom = new Classroom({
      name,
      description,
      classCode,
      teacherId: req.user._id
    });

    await classroom.save();
    await classroom.populate('teacherId', 'name email');

    res.status(201).json({
      message: 'Classroom created successfully',
      classroom
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all created classrooms
router.get('/classrooms', auth, isTeacher, async (req, res) => {
  try {
    const classrooms = await Classroom.find({ teacherId: req.user._id })
      .populate('students', 'name email');

    res.json(classrooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new subject
router.post('/subject', auth, isTeacher, async (req, res) => {
  try {
    const { name, description, classroomId } = req.body;

    // Verify teacher owns the classroom
    const classroom = await Classroom.findOne({
      _id: classroomId,
      teacherId: req.user._id
    });

    if (!classroom) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const subject = new Subject({
      name,
      description,
      classroomId,
      teacherId: req.user._id
    });

    await subject.save();

    // Add subject to classroom
    classroom.subjects.push(subject._id);
    await classroom.save();

    res.status(201).json({
      message: 'Subject created successfully',
      subject
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Post a new announcement for a classroom
router.post('/announcements/:classroomId', auth, isTeacher, async (req, res) => {
  try {
    const Announcement = require('../models/Announcement');
    const { classroomId } = req.params;
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Announcement text is required' });
    }
    const announcement = new Announcement({
      classroomId,
      teacherId: req.user._id,
      title: 'Announcement',
      content: text
    });
    await announcement.save();
    // Populate teacher and classroom info for frontend
    await announcement.populate('teacherId', 'name email');
    await announcement.populate('classroomId', 'name classCode');
    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/classroom/:classroomId', auth, isTeacher, async (req, res) => {
  try {
    const classroom = await Classroom.findOne({ _id: req.params.classroomId, teacherId: req.user._id })
      .populate('students', 'name email')
      .populate('subjects');
    if (!classroom) {
      return res.status(404).json({ error: 'Classroom not found or access denied' });
    }
    res.json(classroom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get announcements for a classroom
router.get('/announcements/:classroomId', auth, isTeacher, async (req, res) => {
  try {
    // Assuming you have an Announcement model
    const Announcement = require('../models/Announcement');
    const announcements = await Announcement.find({ classroomId: req.params.classroomId });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get subjects for a classroom
router.get('/subjects/:classroomId', auth, isTeacher, async (req, res) => {
  try {
    const subjects = await Subject.find({ classroomId: req.params.classroomId, teacherId: req.user._id });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Upload new material with file to Cloudinary
router.post('/material', auth, isTeacher, upload.single('file'), uploadToCloudinary, async (req, res) => {
  try {
    const { title, description, type, subjectId } = req.body;
    const fileUrl = req.file?.cloudinary?.secure_url;

    // Verify teacher owns the subject
    const subject = await Subject.findOne({
      _id: subjectId,
      teacherId: req.user._id
    });

    if (!subject) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const material = new Material({
      title,
      description,
      type,
      fileUrl,
      subjectId,
      teacherId: req.user._id
    });

    await material.save();

    // Add material to subject
    subject.materials.push(material._id);
    await subject.save();

    res.status(201).json({
      message: 'Material uploaded successfully',
      material
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new assignment
// Create new assignment with optional file attachments
router.post('/assignment', auth, isTeacher, upload.array('attachments'), async (req, res) => {
  try {
    const { title, description, instructions, dueDate, totalPoints, subjectId } = req.body;
    let attachments = [];

    // If files are uploaded, upload each to Cloudinary
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => {
        return new Promise((resolve, reject) => {
          const { uploadToCloudinary } = require('../middleware/upload');
          // Use upload_stream for each file
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'assignments' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          streamifier.createReadStream(file.buffer).pipe(stream);
        });
      });
      attachments = await Promise.all(uploadPromises);
    } else if (req.body.attachments) {
      // If no files, use attachments from body (array or single string)
      attachments = Array.isArray(req.body.attachments) ? req.body.attachments : [req.body.attachments];
    }

    // Verify teacher owns the subject
    const subject = await Subject.findOne({
      _id: subjectId,
      teacherId: req.user._id
    });

    if (!subject) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const assignment = new Assignment({
      title,
      description,
      instructions,
      dueDate,
      totalPoints,
      attachments,
      subjectId,
      teacherId: req.user._id
    });

    await assignment.save();

    // Add assignment to subject
    subject.assignments.push(assignment._id);
    await subject.save();

    res.status(201).json({
      message: 'Assignment created successfully',
      assignment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Get all subjects for the teacher
router.get('/subjects', auth, isTeacher, async (req, res) => {
  try {
    const subjects = await Subject.find({ teacherId: req.user._id });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all classrooms for the teacher
router.get('/classrooms', auth, isTeacher, async (req, res) => {
  try {
    const classrooms = await Classroom.find({ teacherId: req.user._id });
    res.json(classrooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all assignments for the teacher
router.get('/assignments', auth, isTeacher, async (req, res) => {
  try {
    const assignments = await Assignment.find({ teacherId: req.user._id });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Get all assignments for a subject (by subjectId)
router.get('/assignments/:subjectId', auth, isTeacher, async (req, res) => {
  try {
    const { subjectId } = req.params;
    const assignments = await Assignment.find({ subjectId, teacherId: req.user._id });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all materials for the teacher
router.get('/materials', auth, isTeacher, async (req, res) => {
  try {
    const materials = await Material.find({ teacherId: req.user._id });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all subjects in a classroom
router.get('/classrooms/:classroomId/subjects', auth, isTeacher, async (req, res) => {
  try {
    const { classroomId } = req.params;
    const subjects = await Subject.find({ classroomId, teacherId: req.user._id });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all assignments in a subject
router.get('/subjects/:subjectId/assignments', auth, isTeacher, async (req, res) => {
  try {
    const { subjectId } = req.params;
    const assignments = await Assignment.find({ subjectId, teacherId: req.user._id });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all materials in a subject
router.get('/subjects/:subjectId/materials', auth, isTeacher, async (req, res) => {
  try {
    const { subjectId } = req.params;
    const materials = await Material.find({ subjectId, teacherId: req.user._id });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all assignments in a classroom
router.get('/classrooms/:classroomId/assignments', auth, isTeacher, async (req, res) => {
  try {
    const { classroomId } = req.params;
    const subjects = await Subject.find({ classroomId, teacherId: req.user._id }).distinct('_id');
    const assignments = await Assignment.find({ subjectId: { $in: subjects }, teacherId: req.user._id });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all materials in a classroom
router.get('/classrooms/:classroomId/materials', auth, isTeacher, async (req, res) => {
  try {
    const { classroomId } = req.params;
    const subjects = await Subject.find({ classroomId, teacherId: req.user._id }).distinct('_id');
    const materials = await Material.find({ subjectId: { $in: subjects }, teacherId: req.user._id });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// POST /file/brief-overview
router.post('/file/brief-overview', auth, isTeacher, async (req, res) => {
  await handleSihRequest(req, res, 'brief-overview');
});

// POST /file/assesment
router.post('/file/assesment', auth, isTeacher, async (req, res) => {
  await handleSihRequest(req, res, 'assesment');
});

// POST /file/podcast
router.post('/file/podcast', auth, isTeacher, async (req, res) => {
  await handleSihRequest(req, res, 'podcast');
});

// Get classroom by ID with populated students and subjects
router.get('/classroom/:classroomId', auth, isTeacher, async (req, res) => {
  try {
    const classroom = await Classroom.findOne({ _id: req.params.classroomId, teacherId: req.user._id })
      .populate('students', 'name email')
      .populate('subjects');
    if (!classroom) {
      return res.status(404).json({ error: 'Classroom not found or access denied' });
    }
    res.json(classroom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Get all materials for a subject
router.get('/materials/:subjectId', auth, isTeacher, async (req, res) => {
  try {
    const materials = await Material.find({ subjectId: req.params.subjectId, teacherId: req.user._id });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// 1. Delete classroom
router.delete('/classrooms/:classroomId', auth, isTeacher, async (req, res) => {
  try {
    const { classroomId } = req.params;
    const classroom = await Classroom.findOne({ _id: classroomId, teacherId: req.user._id });
    if (!classroom) {
      return res.status(404).json({ error: 'Classroom not found or access denied' });
    }
    await classroom.deleteOne();
    res.json({ message: 'Classroom deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Delete subject
router.delete('/subjects/:subjectId', auth, isTeacher, async (req, res) => {
  try {
    const { subjectId } = req.params;
    const subject = await Subject.findOne({ _id: subjectId, teacherId: req.user._id });
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found or access denied' });
    }
    await subject.deleteOne();
    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Delete material
router.delete('/materials/:materialId', auth, isTeacher, async (req, res) => {
  try {
    const { materialId } = req.params;
    const material = await Material.findOne({ _id: materialId, teacherId: req.user._id });
    if (!material) {
      return res.status(404).json({ error: 'Material not found or access denied' });
    }
    await material.deleteOne();
    res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Post a new announcement for a classroom
router.post('/announcements/:classroomId', auth, isTeacher, async (req, res) => {
  try {
    const Announcement = require('../models/Announcement');
    const { classroomId } = req.params;
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Announcement text is required' });
    }
    const announcement = new Announcement({
      classroomId,
      teacherId: req.user._id,
      title: 'Announcement',
      content: text
    });
    await announcement.save();
    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// 4. Delete assignment
router.delete('/assignments/:assignmentId', auth, isTeacher, async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await Assignment.findOne({ _id: assignmentId, teacherId: req.user._id });
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found or access denied' });
    }
    await assignment.deleteOne();
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Optional: Delete teacher account


// GET /subjects-created - Get all subjects created by the teacher
router.get('/subjects-created', auth, isTeacher, async (req, res) => {
  try {
    const subjects = await Subject.find({ teacherId: req.user._id });
    res.json({ subjects });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /materials-created - Get all materials created by the teacher
router.get('/materials-created', auth, isTeacher, async (req, res) => {
  try {
    const materials = await Material.find({ teacherId: req.user._id });
    res.json({ materials });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /assignments-created - Get all assignments created by the teacher
router.get('/assignments-created', auth, isTeacher, async (req, res) => {
  try {
    const assignments = await Assignment.find({ teacherId: req.user._id });
    res.json({ assignments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search classrooms by name or class code
router.get('/search-classrooms', auth, isTeacher, async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim() === '') {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    const regex = new RegExp(query, 'i');
    const classrooms = await Classroom.find({
      teacherId: req.user._id,
      $or: [
        { name: regex },
        { classCode: regex }
      ]
    }).populate('students', 'name email');
    res.json(classrooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

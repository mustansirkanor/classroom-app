


const express = require('express');
const Classroom = require('../models/Classroom');
const Subject = require('../models/Subject');
const Material = require('../models/Material');
const Assignment = require('../models/Assignment');
const Progress = require('../models/Progress');
const { auth, isStudent } = require('../middleware/auth');

const router = express.Router();

// Get student dashboard
router.get('/dashboard', auth, isStudent, async (req, res) => {
  try {
    const classrooms = await Classroom.find({ 
      students: req.user._id 
    }).populate('teacherId', 'name email');

    const totalSubjects = await Subject.countDocuments({
      classroomId: { $in: classrooms.map(c => c._id) }
    });

    const totalMaterials = await Material.countDocuments({
      subjectId: { $in: await Subject.find({
        classroomId: { $in: classrooms.map(c => c._id) }
      }).distinct('_id') }
    });

    const completedMaterialObjects = await Progress.find({
      studentId: req.user._id,
      completed: true
    });

    res.json({
      classrooms,
      stats: {
        totalClassrooms: classrooms.length,
        totalSubjects,
        totalMaterials,
    completedMaterials: completedMaterialObjects.length,
        progressPercentage: totalMaterials > 0 ? Math.round((completedMaterials / totalMaterials) * 100) : 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

  // Get all announcements for all enrolled classrooms
  router.get('/announcements', auth, isStudent, async (req, res) => {
    try {
      const classrooms = await Classroom.find({ students: req.user._id }).select('_id');
      const classroomIds = classrooms.map(c => c._id);
      const Announcement = require('../models/Announcement');
      const announcements = await Announcement.find({ classroomId: { $in: classroomIds } }).sort({ createdAt: -1 });
      res.json(announcements);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Join classroom with code
router.post('/join-class', auth, isStudent, async (req, res) => {
  try {
    const { classCode } = req.body;

    const classroom = await Classroom.findOne({ classCode });
    if (!classroom) {
      return res.status(404).json({ error: 'Invalid class code' });
    }

    // Check if student is already enrolled
    if (classroom.students.includes(req.user._id)) {
      return res.status(400).json({ error: 'Already enrolled in this classroom' });
    }

    // Add student to classroom
    classroom.students.push(req.user._id);
    await classroom.save();

    await classroom.populate('teacherId', 'name email');

    res.json({
      message: 'Successfully joined classroom',
      classroom
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Get subject details for a student
router.get('/subject/:subjectId', auth, isStudent, async (req, res) => {
  try {
    const { subjectId } = req.params;
    const subject = await Subject.findById(subjectId)
      .populate('classroomId', 'name classCode')
      .populate('teacherId', 'name email');
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    res.json(subject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get announcements for a classroom (for students)
router.get('/announcements/:classroomId', auth, isStudent, async (req, res) => {
  try {
    const Announcement = require('../models/Announcement');
    const { classroomId } = req.params;
    // Only allow if student is enrolled
    const classroom = await Classroom.findOne({ _id: classroomId, students: req.user._id });
    if (!classroom) {
      return res.status(403).json({ error: 'Access denied' });
    }
    const announcements = await Announcement.find({ classroomId });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Get all enrolled classrooms
router.get('/classrooms', auth, isStudent, async (req, res) => {
  try {
    const classrooms = await Classroom.find({ 
      students: req.user._id 
    }).populate('teacherId', 'name email');

    res.json(classrooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Get classroom details for a student
router.get('/classroom/:classroomId', auth, isStudent, async (req, res) => {
  try {
    const { classroomId } = req.params;
    // Only allow if student is enrolled
    const classroom = await Classroom.findOne({ _id: classroomId, students: req.user._id })
      .populate('teacherId', 'name email')
      .populate('subjects');
    if (!classroom) {
      return res.status(404).json({ error: 'Classroom not found or access denied' });
    }
    res.json(classroom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get subjects in classroom
router.get('/subjects/:classroomId', auth, isStudent, async (req, res) => {
  try {
    const { classroomId } = req.params;

    // Verify student is enrolled in classroom
    const classroom = await Classroom.findOne({
      _id: classroomId,
      students: req.user._id
    });

    if (!classroom) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const subjects = await Subject.find({ classroomId })
      .populate('teacherId', 'name');

    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get materials for subject
router.get('/materials/:subjectId', auth, isStudent, async (req, res) => {
  try {
    const { subjectId } = req.params;

    const materials = await Material.find({ subjectId })
      .populate('teacherId', 'name')
      .sort({ createdAt: -1 });

    // Get progress for each material
    const materialsWithProgress = await Promise.all(
      materials.map(async (material) => {
        const progress = await Progress.findOne({
          studentId: req.user._id,
          materialId: material._id
        });

        return {
          a,
          ...material.toObject(),
          progress: progress ? progress.progress : 0,
          completed: progress ? progress.completed : false
        };
      })
    );

    res.json(materialsWithProgress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get assignments for subject
router.get('/assignments/:subjectId', auth, isStudent, async (req, res) => {
  try {
    const { subjectId } = req.params;

    const assignments = await Assignment.find({ subjectId })
      .populate('teacherId', 'name')
      .sort({ dueDate: 1 });

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark material as completed
router.patch('/progress/:materialId', auth, isStudent, async (req, res) => {
  try {
    const { materialId } = req.params;
    const { progress = 100, completed = true } = req.body;

    const material = await Material.findById(materialId);
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    let progressRecord = await Progress.findOne({
      studentId: req.user._id,
      materialId
    });

    if (!progressRecord) {
      progressRecord = new Progress({
        studentId: req.user._id,
        materialId,
        subjectId: material.subjectId,
        progress,
        completed,
        completedAt: completed ? new Date() : undefined
      });
    } else {
      progressRecord.progress = progress;
      progressRecord.completed = completed;
      if (completed && !progressRecord.completedAt) {
        progressRecord.completedAt = new Date();
      }
    }

    await progressRecord.save();

    res.json({
      message: 'Progress updated successfully',
      progress: progressRecord
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Get all classrooms for the student
router.get('/classrooms', auth, isStudent, async (req, res) => {
  try {
    const classrooms = await Classroom.find({ students: req.user._id });
    res.json(classrooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all subjects for the student
router.get('/all-subjects', auth, isStudent, async (req, res) => {
  try {
    const classrooms = await Classroom.find({ students: req.user._id }).distinct('_id');
    const subjects = await Subject.find({ classroomId: { $in: classrooms } });
    res.json({ subjects });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all assignments for the student
router.get('/assignments', auth, isStudent, async (req, res) => {
  try {
    const classrooms = await Classroom.find({ students: req.user._id }).distinct('_id');
    const subjects = await Subject.find({ classroomId: { $in: classrooms } }).distinct('_id');
    const assignments = await Assignment.find({ subjectId: { $in: subjects } });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all materials for the student
router.get('/all-materials', auth, isStudent, async (req, res) => {
  try {
    const classrooms = await Classroom.find({ students: req.user._id }).distinct('_id');
    const subjects = await Subject.find({ classroomId: { $in: classrooms } }).distinct('_id');
    const materials = await Material.find({ subjectId: { $in: subjects } });
    res.json({ materials });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all completed materials for the student
router.get('/completed-materials', auth, isStudent, async (req, res) => {
  try {
    const completedProgress = await Progress.find({ studentId: req.user._id, completed: true }).populate('materialId');
    const completedMaterials = completedProgress.map(p => p.materialId);
    res.json({ completedMaterials });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all subjects in a classroom
router.get('/classrooms/:classroomId/subjects', auth, isStudent, async (req, res) => {
  try {
    const { classroomId } = req.params;
    const subjects = await Subject.find({ classroomId });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all assignments in a subject
router.get('/subjects/:subjectId/assignments', auth, isStudent, async (req, res) => {
  try {
    const { subjectId } = req.params;
    const assignments = await Assignment.find({ subjectId });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all materials in a subject
router.get('/subjects/:subjectId/materials', auth, isStudent, async (req, res) => {
  try {
    const { subjectId } = req.params;
    const materials = await Material.find({ subjectId });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all assignments in a classroom
router.get('/classrooms/:classroomId/assignments', auth, isStudent, async (req, res) => {
  try {
    const { classroomId } = req.params;
    const subjects = await Subject.find({ classroomId }).distinct('_id');
    const assignments = await Assignment.find({ subjectId: { $in: subjects } });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all materials in a classroom
router.get('/classrooms/:classroomId/materials', auth, isStudent, async (req, res) => {
  try {
    const { classroomId } = req.params;
    const subjects = await Subject.find({ classroomId }).distinct('_id');
    const materials = await Material.find({ subjectId: { $in: subjects } });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// DELETE ROUTES (sorted)

// 1. Remove student from classroom
router.delete('/classrooms/:classroomId', auth, isStudent, async (req, res) => {
  try {
    const { classroomId } = req.params;
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ error: 'Classroom not found' });
    }
    classroom.students = classroom.students.filter(
      (id) => id.toString() !== req.user._id.toString()
    );
    await classroom.save();
    res.json({ message: 'Removed from classroom successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Delete student's progress for a material
router.delete('/progress/:materialId', auth, isStudent, async (req, res) => {
  try {
    const { materialId } = req.params;
    const result = await Progress.findOneAndDelete({
      studentId: req.user._id,
      materialId
    });
    if (!result) {
      return res.status(404).json({ error: 'Progress not found' });
    }
    res.json({ message: 'Progress deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Delete student's account (and related data)




// GET /classrooms-enrolled - Get all classrooms where student is enrolled
router.get('/classrooms-enrolled', auth, isStudent, async (req, res) => {
  try {
    const classrooms = await Classroom.find({ students: req.user._id });
    res.json({ classrooms });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /subjects-enrolled - Get all subjects where student is enrolled
router.get('/subjects-enrolled', auth, isStudent, async (req, res) => {
  try {
    const classrooms = await Classroom.find({ students: req.user._id });
    const classroomIds = classrooms.map(c => c._id);
    const subjects = await Subject.find({ classroomId: { $in: classroomIds } });
    res.json({ subjects });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search classrooms by name or class code
router.get('/search-classrooms', auth, isStudent, async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim() === '') {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    const regex = new RegExp(query, 'i');
    const classrooms = await Classroom.find({
      $or: [
        { name: regex },
        { classCode: regex }
      ]
    }).populate('teacherId', 'name email');
    res.json(classrooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

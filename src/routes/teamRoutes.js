const express = require('express')
const router = express.Router()
const {
  getTeamMembers,
  getTeamMember,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} = require('../controllers/teamController')
const { protect, adminOnly } = require('../middleware/auth')
const upload = require('../utils/upload')

router.get('/', getTeamMembers)
router.get('/:id', getTeamMember)
router.post('/', protect, adminOnly, upload.single('image'), createTeamMember)
router.put('/:id', protect, adminOnly, upload.single('image'), updateTeamMember)
router.delete('/:id', protect, adminOnly, deleteTeamMember)

module.exports = router

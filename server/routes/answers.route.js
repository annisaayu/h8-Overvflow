const router = require('express').Router()
const {
  addAnswer,
  updateAnswer,
  removeAnswer,
  findAnswer,
  upVote,
  downVote,
  deleteAnswer
} = require('../controllers/answer.controller')

const {
  authentication,
} = require('../middlewares/auth')

router.post('/:questionId/add', addAnswer)
router.get('/:id', findAnswer)
router.put('/:id/up-vote', authentication, upVote)
router.put('/:id/down-vote', authentication, downVote)
router.delete('/:id', authentication, deleteAnswer)


module.exports = router

var router = require('express').Router();

const {
    authentication,
} = require('../middlewares/auth')

const {
    addPost,
    showPosts,
    findPost,
    editPost,
    deletePost,
    upVote,
    downVote
} = require('../controllers/question.controller')


router.post('/add', authentication, addPost)
router.get('/', showPosts)
router.get('/:id', authentication, findPost)
router.put('/:id', authentication, editPost)
router.delete('/:id', authentication, deletePost)
router.put('/:id/up-vote', authentication, upVote)
router.put('/:id/down-vote', authentication, downVote)

module.exports = router


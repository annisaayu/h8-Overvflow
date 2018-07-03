const router = require('express').Router()
const {
  signIn,
  signUp,
  loginFB
} = require('../controllers/user.controller')

router.post('/sign-in', signIn)
router.post('/sign-up', signUp)
router.post('/loginFB', loginFB)

module.exports = router

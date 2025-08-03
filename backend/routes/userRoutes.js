const { registerUser, loginUser, getUserData, getCars } = require('../controller/UserController')
const protect = require("../middleware/authMiddleWare")
const router = require('express').Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get("/data", protect, getUserData)
router.get('/cars', getCars)
module.exports = router;
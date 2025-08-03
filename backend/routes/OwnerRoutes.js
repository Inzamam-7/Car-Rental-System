const {changeRoleToOwner, addCar, getOwnerCars, toggleAvailableCar, deleteCar, dashboardData, updateUserImage} = require('../controller/ownerController');
const protect = require('../middleware/authMiddleWare');
const router = require('express').Router();
const upload = require("../middleware/multer")


router.post('/change-role', protect, changeRoleToOwner)
router.post('/add-car',upload.single('image'), protect, addCar)
router.get('/cars', protect, getOwnerCars)
router.post('/toggle-car', protect, toggleAvailableCar)
router.post('/delete-car', protect, deleteCar)
router.get('/dashboard', protect, dashboardData)
router.post('/update-image', upload.single('image'), protect, updateUserImage)
module.exports = router;
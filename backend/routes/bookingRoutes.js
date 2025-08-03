const router = require("express").Router();
const {checkAvailabilityOfCar, createBooking, getUserBookings, getOwnerBookings, changeBookingStatus} = require("../controller/bookingController")
const protect = require('../middleware/authMiddleWare')

router.post('/check-availability', checkAvailabilityOfCar)
router.post('/create', protect, createBooking)
router.get('/user', protect, getUserBookings)
router.get("/owner", protect, getOwnerBookings)
router.post('/change-status', protect, changeBookingStatus)

module.exports = router
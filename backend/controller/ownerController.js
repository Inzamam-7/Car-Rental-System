const imagekit = require("../configs/imageKit");
const User = require("../models/User");
const Car = require("../models/Car")
const fs = require('fs');
const Booking = require("../models/Booking");
//Api to change role of user
const changeRoleToOwner = async (req, res) => {
    try {
        const { id } = req.user;
        await User.findByIdAndUpdate(id, { role: "owner" })
        res.json({
            success: true,
            message: "Now you can list car"
        })
    } catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: "Internal server error"
        })
    }
}


//Api to list car
const addCar = async(req,res) =>{
    try{
        const {_id} = req.user;
        console.log(_id);
        console.log(req.user);
        
        
        let car = JSON.parse(req.body.carData);
        const imageFile = req.file;
 
        //Upload image to imageKit
        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file:fileBuffer,
            fileName:imageFile.originalname,
            folder: '/cars'
        })

        //optimization through imagekit URL transformation
        var optimizedImageUrl = imagekit.url({
            path : response.filePath,
            transformation: [
                {width: '1280'}, // Width resizing
                {quality: 'auto'}, //Auto compression
                {format: 'webp'} //Convert to modern format
            ]
        });

        const image = optimizedImageUrl;
        await Car.create({...car, owner: _id, image})

        res.json({
            success:true,
            message: "Car Added"
        })

    }catch(error){
        console.log(error.message);
        res.json({
            success: false,
            message: "Internal server error"
        })
    }
}


//Api to list owner Cars

const getOwnerCars = async(req,res) =>{
    try{
        const {_id} = req.user;
        const cars = await Car.find({owner: _id})
        res.json({
            success: true,
            cars
        })

    }catch(error){
        console.log(error.message);
        res.json({
            success: false,
            message: "Internal server error"
        })
    }
}

//API to toggle Car Availability
const toggleAvailableCar = async(req,res) =>{
    try{
        const {_id} = req.user;
        const {carId} = req.body;
        const car = await Car.findById(carId);

        //checking is car belongs to the user
        if(car.owner.toString() !== _id.toString()){
            return res.json({
                success:false,
                message: "This car does not belongs to the user"
            })
        }

        car.isAvailable = !car.isAvailable
        await car.save()

        res.json({
            success:true,
            message: "Availability Toggled"
        })
    }catch(error){
        console.log(error.message);
        res.json({
            success: false,
            message: "Internal server error"
        })
    }
}


//API to delete a Car
const deleteCar = async(req,res) =>{
    try{
        const {_id} = req.user;
        const {carId} = req.body;
        const car = await Car.findById(carId);

        //checking is car belongs to the user
        if(car.owner.toString() !== _id.toString){
            return res.json({
                success:false,
                message: "This car does not belongs to the user"
            })
        }

       car.owner = null;
       car.isAvailable = false
        await car.save()

        res.json({
            success:true,
            message: "Availability Toggled"
        })
    }catch(error){
        console.log(error.message);
        res.json({
            success: false,
            message: "Internal server error"
        })
    }
}

//API to get dashboard data

const dashboardData = async(req,res) =>{
    try{
        const {_id, role} = req.user;
        if(role !== "owner"){
            return res.json({
                success:false,
                message: "Unauthorized"
            })
        }

        const cars = await Car.find({owner: _id})
        const bookings = await Booking.find({owner: _id}).populate('car').sort({createdAt: -1})

        const pendingBookings = await Booking.find({owner: _id, status:"pending"})
        const confirmedBookings = await Booking.find({owner: _id, status:"confirmed"})

       //Calculate monthly Revenue from bookings where status is confirmed 
       const monthlyRevenue = bookings.slice().filter(booking => booking.status === 'confirmed').reduce((acc, booking) => acc+ booking.price, 0)

       const dashboardData = {
        totalCars : cars.length,
        totalBookings: bookings.length,
        pendingBookings: pendingBookings.length,
        completedBookings: confirmedBookings.length,
        recentBookings: bookings.slice(0,3),
        monthlyRevenue
       }

       res.json({
        success:true,
        dashboardData
       })

    }catch(error){
        console.log(error.message);
        res.json({
            success: false,
            message: "Internal server error"
        })
    }
}

//API to update user image
const updateUserImage = async(req,res) =>{
     try{
         const {_id} = req.user;

        const imageFile = req.file;
 
        //Upload image to imageKit
        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file:fileBuffer,
            fileName:imageFile.originalname,
            folder: '/users'
        })

        //optimization through imagekit URL transformation
        var optimizedImageUrl = imagekit.url({
            path : response.filePath,
            transformation: [
                {width: '400'}, // Width resizing
                {quality: 'auto'}, //Auto compression
                {format: 'webp'} //Convert to modern format
            ]
        });

        const image = optimizedImageUrl;
        await User.findByIdAndUpdate(_id, {image})

        res.json({
            success:true,
            message: "Image Updated"
        })

     }catch(error){
        res.json({
            success: false,
            message: "Internal server error"
        })
     }
}


module.exports = {changeRoleToOwner,addCar,getOwnerCars, toggleAvailableCar, deleteCar, dashboardData, updateUserImage}
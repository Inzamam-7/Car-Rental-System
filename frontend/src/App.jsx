import React, { useState } from 'react';
import {  Routes, Route, useLocation, BrowserRouter } from 'react-router-dom';
import './App.css'
import Navbar from './components/Navbar';
import Home from './pages/Home'
import CarDetails from './pages/CarDetails'
import Car from './pages/car'
import MyBookings from "./pages/MyBookings"
import Footer from './components/Footer';
import Dashboard from './pages/owner/Dashboard'
import Layout from './pages/owner/Layout'
import AddCar from './pages/owner/AddCar';
import ManageBookings from './pages/owner/ManageBookings';
import ManageCars from './pages/owner/ManageCars'
import Login from './components/Login';
import {Toaster} from 'react-hot-toast'
import { useAppContext } from './context/AppContext';
function App() {
   const {showLogin} = useAppContext()
   const isOwnerPath = useLocation().pathname.startsWith('/owner')
  return (
    <>
    <Toaster />

    {showLogin && <Login/>}
    
      {/* <h1 className='text-center text-2xl font-bold pt-5'>Hello Car Rental System 🚗</h1> */}
      {!isOwnerPath && <Navbar/>}

      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/car-details/:id' element={<CarDetails/>}/>
        <Route path='/cars' element={<Car/>}/>
        <Route path='/my-booking' element={<MyBookings/>}/>
        
        {/* Owner Routes */}
        <Route path='/owner' element={<Layout/>}>
        <Route index element= {<Dashboard/>}/>
        <Route path='add-car' element={<AddCar/>}/>
        <Route path='manage-cars' element={<ManageCars/>}/>
        <Route path='manage-bookings' element={<ManageBookings/>}/>
        </Route>
      </Routes>

      {!isOwnerPath && <Footer/>}
    </>
  )
}

export default App

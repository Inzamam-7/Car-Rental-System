import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.svg'
import search_icon from '../assets/search_icon.svg'
import closeIcon from '../assets/close_icon.svg'
import menuIcon from '../assets/menu_icon.svg'
import { useAppContext } from '../context/AppContext'
const Navbar = () => {

    const {setShowLogin, user, toast, logout, isOwner, axios, setIsOwner} = useAppContext()
    
    const menuLinks = [
        { name: "Home", path: '/' },
        { name: "Cars", path: "/cars" },
        { name: "My Bookings", path: "/my-booking" },
    ]
    const location = useLocation();
    const [open, setOpen] = useState(false)
    const navigate = useNavigate();

    const changeRole = async() =>{
        try{
            const {data} = await axios.post('/api/owner/change-role')
            console.log("yeh h data",data);
            
            if(data.success){
                setIsOwner(true)
                toast.success(data.message)
            }else{
                toast.error(data.message)
            }

        }catch(error){
            toast.error(error.response.message)

        }
    }
    return (
        <div className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor relative transition-all ${location.pathname === "/" && "bg-white"}`}>
            <Link to="/">
                <img src={logo} alt='logo' className='h-8' />
            </Link>

            <div className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50  ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}>
                {menuLinks.map((link, index) => {
                    return (
                        <Link key={index} to={link.path}>
                            {link.name}
                        </Link>
                    )
                })}

                <div className='hidden lg:flex items-center text-sm gap-2 border border-borderColor px-3 rounded-full max-w-56'>
                    <input
                    type='text'
                    placeholder='Search products'
                    className='py-1.5 w-full bg-transparent outline-none placeholder-gray-500'
                    />
                    <img src ={search_icon} alt='search'/>
                </div>
                <div className='flex max-sm:flex-col items-start sm:items-center gap-6'>
                    <button onClick={() => isOwner ? navigate('/owner') : changeRole()} className='cursor-pointer'>
                       {isOwner ?  'Dashboard' : 'List Cars'}
                    </button>
                     <button onClick={() =>{user ? logout() : setShowLogin(true)}} className={`cursor-pointer px-8 py-2 ${user ? "bg-red-500 hover:bg-red-700" : "bg-primary hover:bg-primary-dull"} transition-all text-white rounded-lg`}>
                       {user ? 'Logout' : ' Login'}
                    </button>
                </div>
            </div>

            <button className='sm:hidden cursor-pointer' aria-label='Menu' onClick = {() =>setOpen(!open)}>
                <img src={open ? closeIcon : menuIcon} alt='menu'/>
            </button>
        </div>
    )
}

export default Navbar
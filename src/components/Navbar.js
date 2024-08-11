import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { IoLogInOutline } from "react-icons/io5";
import { MdOutlineStorefront } from "react-icons/md";
import { CiMenuFries } from "react-icons/ci";
import "../styles/Navbar.css";

const Navbar = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const token = localStorage.getItem('token');
    const [showMenu, setShowMenu] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search/${query}`);
        }
        setQuery('');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    return (
        <div className='navSection'>
            <div className="container">
                <div className="navBar">
                    <nav>
                        <div className="logo">
                            <img src="images/logo-no-background.png" alt="logo" />
                        </div>
                        <div className="search">
                            <form onSubmit={handleSubmit}>
                                <input 
                                    type="text" 
                                    placeholder='Search' 
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)} 
                                />
                                <button type="submit" disabled={!query.trim()}>Submit</button>
                            </form>
                        </div>
                        <div className="menu" onClick={toggleMenu}>
                            <CiMenuFries />
                        </div>
                        <div className={`links ${showMenu ? 'show' : ''}`}>
                            <div className="nav-link">
                                <FaHome />
                                <Link to='/'><li>Home</li></Link>
                            </div>
                            {token ? (
                                <div className="nav-link">
                                    <MdOutlineStorefront />
                                    <Link to='/seller'><li>Seller</li></Link>
                                </div>
                            ) : (
                                <div className="nav-link">
                                    <IoLogInOutline />
                                    <Link to='/login'><li>Login</li></Link>
                                </div>
                            )}
                            <div className="nav-link">
                                <FaShoppingCart />
                                <Link to='/cart'><li>Cart</li></Link>
                            </div>
                            <div className="user nav-link">
                                <FaUserCircle className='user-icon' />
                                <ul className='dropDown'>
                                    <Link to='/profile'><li>Profile</li></Link>
                                    <Link to='/wishlist'><li>Wishlist</li></Link>
                                    <Link to='/user'><li>Details</li></Link>
                                    {token && <li onClick={handleLogout}>Logout</li>}
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Navbar;

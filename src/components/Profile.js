// src/components/Profile.js
import React, { useEffect, useState, useContext } from 'react';
import '../styles/Profile.css';
import { Link } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import axios from 'axios';
import { AiTwotoneBank } from "react-icons/ai";
import { FaAddressCard } from "react-icons/fa";
import { url } from '../middlewares/Urls';
import { UserAddressContext } from '../components/UserAddress';

const Profile = () => {
    const token = localStorage.getItem('token');
    const [userData, setUserData] = useState([]);
    const { userAddress, loading } = useContext(UserAddressContext);
    const [orderData, setOrderData] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${url}/api/user_data`, {  
                    headers: {
                        token: token
                    }
                });
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [token]);

    const formatDateOfBirth = (dob) => {
        if (!dob) return '';
        const date = new Date(dob);
        return date.toLocaleDateString();
    };

    useEffect(() => {
        const getOrderData = async () => {
            try {
                const res = await axios.get(`${url}/api/order_data`, {
                    headers: {
                        token: token
                    }
                });
                if (Array.isArray(res.data)) {
                    setOrderData(res.data);
                } else {
                    console.log('unexpected data format');
                }
            } catch (error) {
                console.log('error at order data fetching', error);
            }
        };

        getOrderData();
    }, [token]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile">
            {token ? (
                <div className="container">
                    <div className="userInfo">
                        <div className="image">
                            <div>
                                <img src="images/avathar.png" alt="profile" />
                            </div>
                            <div>
                                {userData.length === 0 ? (
                                    <Link to={'/user_details'}><button>Personal Information</button></Link>
                                ) : (
                                    userData.map((item) => (
                                        <div key={item._id} className='name'>
                                            Hi <span>{item.firstName} {item.lastName}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                        <div className="info">
                            <div className='head'>
                                <span><FaUser /></span>
                                <span>USER INFO</span>
                            </div>
                            <div className='userPersonalData'>
                                {userData.map((item) => (
                                    <ul key={item._id}>
                                        <li>{item.firstName}</li>   
                                        <li>{item.lastName}</li>
                                        <li>{item.mobileNumber}</li>
                                        <li>{formatDateOfBirth(item.dateOfBirth)}</li>
                                        <li>{item.gender}</li>
                                    </ul>
                                ))}
                            </div>
                            <div className="userBankDetails">
                                <div className="head">
                                    <span><FaAddressCard /></span>
                                    <span>ADDRESS DETAILS</span>
                                </div>
                                <div className='address'>
                                    {userAddress.map((item) => (
                                        <ul key={item._id}>
                                            <li>{item.address.houseNumber}</li>
                                            <li>{item.address.street}</li>
                                            <li>{item.address.village}</li>
                                            <li>{item.address.pincode}</li>
                                            <li>{item.address.city}</li>
                                            <li>{item.address.state}</li>
                                            <li>{item.address.country}</li>
                                            <li>{item.address.postelCode}</li>
                                            <div className="bankDetails">
                                                <div className="head">
                                                    <span><AiTwotoneBank /></span>
                                                    <span>BANK DETAILS</span>
                                                </div>
                                                <li>{item.bankAccountDetails.bankName}</li>
                                                <li>{item.bankAccountDetails.accountNumber}</li>
                                                <li>{item.bankAccountDetails.ifscCode}</li>
                                            </div>
                                        </ul>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="orders">
                        <div className="items">
                            <table className='table'>
                                <thead>
                                    <tr>
                                        <th>Serial No</th>
                                        <th>Product Name</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                        <th>Cancel</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderData.map((order, orderIndex) => (
                                        order.items.map((item, itemIndex) => (
                                            <tr key={item._id + '-' + itemIndex}>
                                                <td>{orderIndex * order.items.length + itemIndex + 1}</td>
                                                <td>{item.productId?.name || 'Unknown Product'}</td>
                                                <td>${item.productId?.price || 'N/A'}</td>
                                                <td>{item.quantity}</td>
                                                <td>${item.productId?.price * item.quantity || 'N/A'}</td>
                                                <td>
                                                    <div className='Btn'>
                                                        <button>Cancel</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='auth'>
                    <span>There Is An Authentication Issue</span>
                    <span>Please Login Again</span>
                    <Link to={'/login'}><button>Login Page</button></Link>
                </div>
            )}
        </div>
    );
};

export default Profile;

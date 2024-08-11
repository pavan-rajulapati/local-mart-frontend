import React, { useState } from 'react';
import '../styles/UserAddress.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import {url} from '../middlewares/Urls'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const User_address = () => {
    const navigate = useNavigate()
    const [userData, setUserData] = useState({
        address: {
            houseNumber: '',
            street: '',
            village: '',
            pincode: '',
            city: '',
            state: '',
            country: '',
            postelCode: ''
        },
        bankAccountDetails: {
            bankName: '',
            accountNumber: '',
            ifscCode: ''
        }
    });

    const handleInput = (e) => {
        const { name, value } = e.target;
        const [section, key] = name.split('.');
        setUserData(prevData => ({
            ...prevData,
            [section]: {
                ...prevData[section],
                [key]: value
            }
        }));
    };

    const token = localStorage.getItem('token')

    const validateFields = () => {
        const { address, bankAccountDetails } = userData;

        if (Object.values(address).some(field => field === '') || Object.values(bankAccountDetails).some(field => field === '')) {
            return 'Fields should not be empty';
        }
        if (bankAccountDetails.accountNumber.length < 8 || bankAccountDetails.accountNumber.length > 12) {
            return 'Enter a valid account number';
        }
        if (address.postelCode.length !== 6) {
            return 'Enter a valid postal code';
        }
        if (address.pincode.length !== 6){
            return 'Enter a valid pincode'
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateFields();
        if (validationError) {
            toast.error(validationError);
        } else {
            try {
                await axios.post(`${url}/api/add_address`,userData,{
                    headers:{
                        token:token
                    }
                })
                toast.success('Address added')
                navigate('/seller')
            } catch (error) {
                console.log(error)
            }
        }
    };

    return (
        <div>
            {token ? (
                <div className="userAddress">
                    <div className="container">
                        <div className="user">
                            <form onSubmit={handleSubmit}>
                                <div className="inputFields">
                                    <input type="text" value={userData.address.houseNumber} name='address.houseNumber' onChange={handleInput} placeholder='House Number' />
                                    <input type="text" value={userData.address.street} name='address.street' onChange={handleInput} placeholder='Street' />
                                    <input type="text" value={userData.address.village} name='address.village' onChange={handleInput} placeholder='Village' />
                                    <input type="number" value={userData.address.pincode} name='address.pincode' onChange={handleInput} placeholder='Pincode' />
                                    <input type="text" value={userData.address.city} name='address.city' onChange={handleInput} placeholder='City' />
                                    <input type="text" value={userData.address.state} name='address.state' onChange={handleInput} placeholder='State' />
                                    <input type="text" value={userData.address.country} name='address.country' onChange={handleInput} placeholder='Country' />
                                    <input type="number" value={userData.address.postelCode} name='address.postelCode' onChange={handleInput} placeholder='Postel Code' />
                                    <input type="text" value={userData.bankAccountDetails.bankName} name='bankAccountDetails.bankName' onChange={handleInput} placeholder='Bank Name' />
                                    <input type="number" value={userData.bankAccountDetails.accountNumber} name='bankAccountDetails.accountNumber' onChange={handleInput} placeholder='Account Number' />
                                    <input type="text" value={userData.bankAccountDetails.ifscCode} name='bankAccountDetails.ifscCode' onChange={handleInput} placeholder='IFSC Code' />
                                </div>
                                <div className="Btn">
                                    <button type='submit'>Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            ):
            (
                <div className='auth'>
                        <span>There Is An Authentication Issue</span>
                        <span>Please Login Again</span>
                        <Link to={'/login'}><button>Login Page</button></Link>
                </div>
            )}
            <ToastContainer/>
        </div>
    );
}

export default User_address;

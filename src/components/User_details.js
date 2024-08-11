import React, { useState } from 'react';
import '../styles/UserDetails.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Profile from '../components/Profile';
import { url } from '../middlewares/Urls';

const UserDetails = () => {
    const [detailsAdded, setDetailsAdded] = useState(false);
    const [data, setData] = useState({
        firstName: '',
        lastName: '',
        mobileNumber: '',
        dateOfBirth: '',
        gender: ''
    });

    const navigate = useNavigate();

    const handleInput = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const validation = () => {
        if (Object.values(data).some(field => field === '')) {
            return 'Fill all the fields';
        }
        if (data.mobileNumber.length !== 10) {
            return 'Enter a valid mobile number';
        }
    };

    const handleSubmit = async (e) => {
        const token = localStorage.getItem('token');
        e.preventDefault();
        const validationError = validation();
        if (validationError) {
            toast.error(validationError);
        } else {
            try {
                await axios.post(`${url}/api/add_details`, data, {
                    headers: {
                        token: token
                    }
                });
                setDetailsAdded(true);
                navigate('/profile');
            } catch (error) {
                console.log(error);
                toast.error('Internal Error');
            }
        }
    };

    return (
        <div className="userData">
            <div className="formContainer">
                {!detailsAdded ? (
                    <div className="form">
                        <form onSubmit={handleSubmit}>
                            <div className="inputFields">
                                <input type="text" name="firstName" value={data.firstName} onChange={handleInput} placeholder="First name" />
                                <input type="text" name="lastName" value={data.lastName} onChange={handleInput} placeholder="Last name" />
                                <input type="number" name="mobileNumber" value={data.mobileNumber} onChange={handleInput} placeholder="Mobile number" />
                                <input type="date" name="dateOfBirth" value={data.dateOfBirth} onChange={handleInput} placeholder="Date of birth" />
                                <label>
                                    <input type="radio" name="gender" value="male" onChange={handleInput} checked={data.gender === 'male'} />
                                    Male
                                </label>
                                <label>
                                    <input type="radio" name="gender" value="female" onChange={handleInput} checked={data.gender === 'female'} />
                                    Female
                                </label>
                                <label>
                                    <input type="radio" name="gender" value="other" onChange={handleInput} checked={data.gender === 'other'} />
                                    Other
                                </label>
                            </div>
                            <div className="Btn">
                                <button type="submit">Add details</button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <Profile detailsAdded={detailsAdded} />
                )}
            </div>
            <ToastContainer />
        </div>
    );
};

export default UserDetails;

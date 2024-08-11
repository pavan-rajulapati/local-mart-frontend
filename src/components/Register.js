import React, { useState, } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link,useNavigate } from 'react-router-dom';
import '../styles/Register.css';
import axios from 'axios';
import { url } from '../middlewares/Urls';

const Register = () => {
    const [registerData, setRegisterData] = useState({
        userName: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate()

    const handleInput = (e) => {
        const { name, value } = e.target;
        setRegisterData((prevData) => ({
            ...prevData, [name]: value
        }));
    };

    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (registerData.userName === '' || registerData.email === '' || registerData.password === '') {
            toast.error('Fields Should Not Be Empty');
            return;
        }

        if (!validateEmail(registerData.email)) {
            toast.error('Invalid Email Address');
            return;
        }

        if (registerData.password.length < 8) {
            toast.error('Password length must be greater than 8');
            return;
        }

        try {
            const response = await axios.post(`${url}/api/register`, registerData);
            toast.success(response.data.message);
            navigate('/login')
        } catch (err) {
            toast.error(err.response.data.message);
        }
    };

    return (
        <div className='register'>
            <div className="container">
                <div className="register">
                    <div className="imageSection">
                        <img src="images/pexels-karolina-grabowska-5632381.jpg" alt="cart" />
                    </div>
                    <div className="form">
                        <span className='head'>Register</span>
                        <form onSubmit={handleSubmit}>
                            <div className="inputFields">
                                <input type="text" name='userName' value={registerData.userName} onChange={handleInput} placeholder='Enter your username' />
                                <input type="text" name='email' value={registerData.email} onChange={handleInput} placeholder='Enter your email' />
                                <input type="password" name='password' value={registerData.password} onChange={handleInput} placeholder='Enter your password' />
                            </div>
                            <div className="Btn">
                                <button type='submit'>Register</button>
                            </div>
                            <div className="login">
                                <span>If you already have an account? <Link to='/login'>Login</Link></span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Register;

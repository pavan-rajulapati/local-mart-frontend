import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Login.css';
import axios from 'axios';
import Loader from '../middlewares/Loader';
import {url} from '../middlewares/Urls'

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleInput = (e) => {
        const { name, value } = e.target;
        setLoginData((prevLoginData) => ({
            ...prevLoginData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loginData.email === '' || loginData.password === '') {
            toast.error('Fields should not be empty');
        } else {
            setLoading(true);
            try {
                const response = await axios.post(`${url}/api/login`, loginData);
                toast.success(response.data.message);

                const token = response.data.token;
                localStorage.setItem('token', token);
                let time = 60 * 60 * 5 * 1000;

                setTimeout(() => {
                    localStorage.removeItem('token');
                    toast.info('Session expired. Please log in again.');
                    navigate('/login');
                }, time);

                navigate('/');
            } catch (error) {
                toast.error(error.response?.data?.message || 'Login failed');
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            localStorage.removeItem('token');
            toast.info('Session expired. Please log in again.');
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div>
            <div className="loginContainer">
                <div className="login">
                    <div className="form">
                        <form onSubmit={handleSubmit}>
                            <div className="heading">
                                <span>Login</span>
                            </div>
                            <div className="inputFileds">
                                <input type="text" name='email' onChange={handleInput} placeholder='Enter email' value={loginData.email} />
                                <input type="password" name='password' onChange={handleInput} placeholder='Enter Password' value={loginData.password} />
                            </div>
                            <div className="Btn">
                                <button type='submit'>{loading ? <Loader /> : 'Login'}</button>
                            </div>
                            <div className="loginSignin">
                                <p>If you don't have an account? <Link to={'/register'}>Register</Link></p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Login;

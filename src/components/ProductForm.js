import axios from 'axios';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/productForm.css';
import { Link } from 'react-router-dom';
import {url} from '../middlewares/Urls'

const ProductForm = () => {
    const token = localStorage.getItem('token')
    const [data, setData] = useState({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        category: '',
        quantity: '',
        image: null
    });

    const handleInput = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setData(prevData => ({
                ...prevData,
                [name]: files[0]
            }));
        } else {
            setData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (data.name === '' || data.category === '' || data.description === '' || data.price === '' ||
            data.originalPrice === '' || data.quantity === '' || data.image === null
        ) {
            toast.error('Input should not be empty');
        } else if (data.price < 1 || data.originalPrice < 1 || data.quantity < 1) {
            toast.error('Price and quantity should not be less than 1');
        } else {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('description', data.description);
            formData.append('price', data.price);
            formData.append('originalPrice', data.originalPrice);
            formData.append('category', data.category);
            formData.append('quantity', data.quantity);
            formData.append('file', data.image);

            try {
                const response = await axios.post(`${url}/api/product`, formData, {
                    headers: {
                        token: token
                    }
                });
                toast.success(response.data.message || 'Product added successfully');
                setData({
                    name: '',
                    description: '',
                    price: '',
                    originalPrice: '',
                    category: '',
                    quantity: '',
                    image: null
                });
            } catch (err) {
                if (err.response) {
                    toast.error(err.response.data.message || 'Data not submitted');
                } else {
                    toast.error('An unexpected error occurred');
                }
            }
        }
    };

    return (
        <div>
           {token ? (
            <div className="product-form">
                <div className="container">
                    <div className="form">
                        <form onSubmit={handleSubmit}>
                            <div className="inputFields">
                                <div className="input-group">
                                    <input type="text" value={data.name} name='name' onChange={handleInput} placeholder='Enter name' />
                                </div>
                                <div className="input-group">
                                    <input type="text" value={data.description} name='description' onChange={handleInput} placeholder='Enter description' />
                                </div>
                                <div className="input-group">
                                    <input type="number" value={data.price} name='price' onChange={handleInput} placeholder='Enter price' />
                                </div>
                                <div className="input-group">
                                    <input type="number" value={data.originalPrice} name='originalPrice' onChange={handleInput} placeholder='Enter original price' />
                                </div>
                                <div className="input-group">
                                    <input type="text" value={data.category} name='category' onChange={handleInput} placeholder='Enter category' />
                                </div>
                                <div className="input-group">
                                    <input type="number" value={data.quantity} name='quantity' onChange={handleInput} placeholder='Enter quantity' />
                                </div>
                                <div className="input-group">
                                    <input type="file" name='image' onChange={handleInput} />
                                </div>
                            </div>
                            <div className="Btn">
                                <button type='submit' className='btn btn-blue'>Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
                <ToastContainer/>
            </div>
           ):(
                <div className='auth'>
                            <span>There Is An Authentication Issue</span>
                            <span>Please Login Again</span>
                            <Link to={'/login'}><button>Login Page</button></Link>
                </div>
           )}
        </div>
    );
};

export default ProductForm;

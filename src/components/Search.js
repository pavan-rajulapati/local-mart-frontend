import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaIndianRupeeSign } from "react-icons/fa6";
import { useParams } from 'react-router-dom';
import '../styles/Search.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { url } from '../middlewares/Urls'

const Search = () => {
    const { query } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEmpty, setIsEmpty] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            setProducts([]);
            setIsEmpty(false);
            setError(null);
            setLoading(true);

            try {
                const res = await axios.get(`${url}/api/query/${query}`);
                if (res.status === 200) {
                    if (Array.isArray(res.data) && res.data.length > 0) {
                        setProducts(res.data);
                    } else {
                        setIsEmpty(true);
                    }
                } else {
                    throw new Error('Unexpected response status');
                }
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setIsEmpty(true);
                } else {
                    setError('Error fetching products.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [query]);

    const handleCart = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            const quantity = 1;
            await axios.post(`${url}/api/cart`, { productId, quantity }, {
                headers: {
                    token: token
                }
            });
            toast.success('Item added to cart');
        } catch (err) {
            console.log('Error occurred while adding to cart:', err.response ? err.response.data : err.message);
            toast.error('Error adding item to cart.');
        }
    }

    const handleWishlist = async (productId) => {
        const token = localStorage.getItem('token');
        try {
            let res = await axios.post(`${url}/api/wishlist_item`, { productId }, {
                headers: {
                    token: token
                }
            });
    
            if (res.status === 200) {
                toast.success('Product added to wishlist');
            }
        } catch (error) {
            if (error.response && error.response.status === 302) {
                toast.info('Item already in wishlist');
            } else {
                console.error('Error at sending the data', error.toJSON());
                toast.error('An error occurred while adding the product to the wishlist');
            }
        }
    };

    return (
        <div className="search-results">
            {isEmpty && (
                <div className="emptyData">
                    <img src="..\images\empty data.gif" alt="empty data gif" />
                    <span>Sorry, no results found!</span>
                    <span>Please check the spelling or try searching for something else</span>
                </div>
            )}
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                products.map((product, index) => (
                    <div key={index} className="productCard">
                        <div className="card">
                            <div className="image">
                                <img 
                                    src={`${url}/${product.image}`} 
                                    alt={product.name}
                                    onError={(e) => e.target.src = 'path_to_fallback_image.jpg'} 
                                />
                            </div>
                            <div className="information">
                                <div className="about">
                                    <div className="name">
                                        <p>{product.name}</p>
                                    </div>
                                    <div className="price">
                                        <FaIndianRupeeSign />
                                        <span>{product.price}</span>
                                        <span><del>{product.originalPrice}</del></span>
                                    </div>
                                    <div className="info">
                                        <p>{product.description}</p>
                                    </div>
                                    <div className="Btn">
                                        <button className='btn btn-dark' onClick={() => handleCart(product._id)}>ADD TO CART</button>
                                        <button className='btn' onClick={()=> handleWishlist(product._id)}>ADD TO WISHLIST</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
            <ToastContainer />
        </div>
    );
};

export default Search;

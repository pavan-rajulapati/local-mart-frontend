import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/Search.css';
import { FaRupeeSign } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {url} from '../middlewares/Urls'

const ProductsPage = () => {
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const [isEmpty, setIsEmpty] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            setProducts([]);
            setError(null);
            setIsEmpty(false);
            setLoading(true);

            try {
                const res = await axios.get(`${url}/api/product/${category}`);
                if (Array.isArray(res.data) && res.data.length > 0) {
                    setProducts(res.data);
                } else {
                    setProducts([]);
                    setIsEmpty(true);
                }
            } catch (error) {
                console.log('Error fetching data:', error.message);
                setProducts([]);
                setError("Error fetching data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category]);

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
        <div className="products-page">
            {isEmpty ? (
                <div className="emptyData">
                    <img src="../images/empty data.gif" alt="empty data gif" />
                    <span >Sorry, no results found!</span>
                    <span></span>
                </div>
            ) : (
                token ? (
                    <div className="products-list">
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : (
                            products.length > 0 ? (
                                products.map((product, index) => (
                                    <div key={index} className="productCard">
                                        <div className="card">
                                            <div className="image">
                                                <img src={`${url}/${product.image}`} alt={product.name} />
                                            </div>
                                            <div className="information">
                                                <div className="about">
                                                    <div className="name">
                                                        <p>{product.name}</p>
                                                    </div>
                                                    <div className="price">
                                                        <FaRupeeSign />
                                                        <span> {product.price}</span>
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
                                        <ToastContainer />
                                    </div>
                                ))
                            ) : (
                                <p>No products available.</p>
                            )
                        )}
                    </div>
                ) : (
                    <div className='auth'>
                        <span>There Is An Authentication Issue</span>
                        <span>Please Login Again</span>
                        <Link to={'/login'}><button>Login Page</button></Link>
                    </div>
                )
            )}
        </div>
    );
};

export default ProductsPage;

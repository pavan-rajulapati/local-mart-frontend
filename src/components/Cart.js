import React, { useEffect, useState, useContext } from 'react';
import '../styles/Cart.css';
import { FaIndianRupeeSign } from "react-icons/fa6";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { UserAddressContext } from '../components/UserAddress';
import { url } from '../middlewares/Urls';
import { SellerDataContext } from './SellerData';

const Cart = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const { userAddress } = useContext(UserAddressContext);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const { sellerData } = useContext(SellerDataContext);
    const [sellerId, setSellerId] = useState(sellerData.length > 0 ? sellerData[0]._id : null);

    // Get Cart Items
    useEffect(() => {
        const getCart = async () => {
            try {
                const response = await axios.get(`${url}/api/cart/items`, {
                    headers: {
                        token: token
                    }
                });
                if (response.status === 200) {
                    if (Array.isArray(response.data)) {
                        const updatedProducts = response.data.map(item => ({
                            ...item,
                            quantity: item.quantity || 0
                        }));
                        setProducts(updatedProducts);
                    } else if (response.data === 0) {
                        setError('Your cart is empty');
                    } else {
                        setError('Data is not in array format');
                    }
                } else {
                    setError('Unexpected response status: ' + response.status);
                }
            } catch (error) {
                setError('Error fetching cart data: ' + error.message);
            }
        };
        if (token) {
            getCart();
        }
    }, [token]);

    // Total values
    const getTotalItems = () => {
        return products.reduce((acc, item) => acc + item.quantity, 0);
    };

    const getTotalPrice = () => {
        return products.reduce((acc, item) => acc + (item.product?.price ?? 0) * item.quantity, 0);
    };

    const getTotalOriginalPrice = () => {
        return products.reduce((acc, item) => acc + (item.product?.originalPrice ?? 0) * item.quantity, 0);
    };

    // Remove item
    const removeCart = async (productId) => {
        try {
            await axios.post(
                `${url}/api/remove_cart/${productId}`,
                {},
                {
                    headers: {
                        token: token,
                    },
                }
            );
            toast.success('Item removed');
            const response = await axios.get(`${url}/api/cart/items`, {
                headers: {
                    token: token
                }
            });
            setProducts(response.data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to remove item');
        }
    };

    // Checkout
    const handleCheckout = async () => {
        if (products.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        try {
            const cartItems = products.map(product => ({
                sellerId: product.product.sellerId,
                productId: product.product._id,
                productPrice: product.product.price,
                productName: product.product.name,
                quantity: product.quantity,
            }));

            const response = await axios.post(
                `${url}/api/check_out`,
                {
                    cartItems: cartItems,
                    totalAmount: Math.round(getTotalPrice() * 100), 
                },
                {
                    headers: {
                        token: token,
                    }
                }
            );

            window.location.href = response.data.sessionUrl;
        } catch (error) {
            console.error('Error during checkout:', error);
            toast.error('Failed to proceed with the checkout');
        }
    };

    // Increment and decrement
    const increment = (index) => {
        const updatedProducts = [...products];
        updatedProducts[index].quantity += 1;
        setProducts(updatedProducts);
    };

    const decrement = (index) => {
        const updatedProducts = [...products];
        if (updatedProducts[index].quantity > 0) {
            updatedProducts[index].quantity -= 1;
            setProducts(updatedProducts);
        }
    };

    return (
        <div className="cart">
            {token ? (
                <div className="container">
                    {error ? (
                        <p>{error}</p>
                    ) : (
                        <>
                            <div className="items">
                                {userAddress.length === 0 && 
                                    <div className="address">
                                        <span>Add your address</span>
                                        <Link to={'/user'}><button>Enter Delivery Address</button></Link>
                                    </div>
                                }
                                {products.map((item, index) => (
                                    <div className="cartItems" key={index}>
                                        <div className="cartItem">
                                            <div className="image">
                                                {item.product?.image ? (
                                                    <img src={`${url}/${item.product.image}`} alt={item.product?.name ?? 'No Name'} />
                                                ) : (
                                                    <span>No Image Available</span>
                                                )}
                                            </div>
                                            <div className="cartInfo">
                                                <p>{item.product?.name ?? 'No Name'}</p>
                                                <div className="price">
                                                    <div className="originalPrice">
                                                        <del>
                                                            <span>{item.product?.originalPrice ?? '0'}</span>
                                                        </del>
                                                    </div>
                                                    <div className="offerPrice">
                                                        <span><FaIndianRupeeSign /> </span>
                                                        <span>{item.product?.price ?? '0'}</span>
                                                    </div>
                                                </div>
                                                <div className="Btn">
                                                    <button className='btn btn-red' onClick={() => removeCart(item.product?._id)}>Remove</button>
                                                </div>
                                            </div>
                                            <div className="value">
                                                <div>
                                                    <span>Quantity: {item.quantity}</span>
                                                </div>
                                                <div>
                                                    <button onClick={() => decrement(index)}>Decrease quantity</button>
                                                    <button onClick={() => increment(index)}>Increase quantity</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="itemInfo">
                                <div className="head">
                                    <span>PRICE DETAILS</span>
                                </div>
                                <div className="details">
                                    <div>
                                        <span>Total Items</span>
                                        <span>{getTotalItems()}</span>
                                    </div>
                                    <div>
                                        <span>Offer Price</span>
                                        <div className="amount">
                                            <span><FaIndianRupeeSign /></span>
                                            <span>{getTotalPrice()}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span>Original Price</span>
                                        <div className="amount">
                                            <span><FaIndianRupeeSign /></span>
                                            <span>{getTotalOriginalPrice()}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span>Reward Amount</span>
                                        <span>No Rewards</span>
                                    </div>
                                    <div>
                                        <span>Delivery Charges</span>
                                        <div className="amount">
                                            <span><FaIndianRupeeSign /></span>
                                            <span>79</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="total">
                                    <button onClick={handleCheckout} id='payment' disabled={products.length === 0}>Place Your Order Now</button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <div className='auth'>
                    <span>There Is An Authentication Issue</span>
                    <span>Please Login Again</span>
                    <Link to={'/login'}><button>Login Page</button></Link>
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default Cart;

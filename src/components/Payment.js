import React, { useEffect, useState, useContext } from 'react';
import '../styles/Payment.css';
import axios from 'axios';
import { FaRupeeSign } from "react-icons/fa";
import { UserAddressContext } from './UserAddress';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { url } from '../middlewares/Urls';

const Payment = () => {
    const [showPayment, setShowPayment] = useState(true);
    const [accountDetails, setAccountDetails] = useState([]);
    const [products, setProducts] = useState([]);
    const { userAddress } = useContext(UserAddressContext);
    const [UTR, setUTR] = useState('');

    const token = localStorage.getItem('token');

    useEffect(() => {
        const getCart = async () => {
            if (!token) return;
            try {
                const response = await axios.get(`${url}/api/cart/items`, {
                    headers: { token }
                });
                if (response.status === 200) {
                    if (Array.isArray(response.data)) {
                        setProducts(response.data);
                        console.log('you want product',response.data)
                    } else if (response.data === 0) {
                        console.log('Your cart is empty');
                    } else {
                        console.log('Data is not in array format');
                    }
                } else {
                    console.log('Unexpected response status:', response.status);
                }
            } catch (error) {
                console.log('Error fetching cart data:', error.message);
            }
        };
        getCart();
    }, [token]);

    useEffect(() => {
        const getSellerData = async () => {
            if (!token) return;
            try {
                const response = await axios.get(`${url}/api/get_seller`, {
                    headers: { token }
                });
                if (Array.isArray(response.data)) {
                    setAccountDetails(response.data);
                    console.log('account details',response.data);
                } else {
                    console.log('Data is in unexpected format');
                }
            } catch (error) {
                console.log('Error fetching seller data:', error.message);
            }
        };
        getSellerData();
    }, [token]);


    const getTotalPrice = () => {
        return products.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    };

    const handleOrder = async (e) => {
        e.preventDefault();
        try {
            if (userAddress.length === 0) {
                toast.error('Add Your Address First');
                return;
            }

            if (UTR === '' || UTR.length != 12) {
                toast.error('Enter a valid UTR number');
                return; 
            }

            const orderPromises = products.map((item) => {
                const orderData = {
                    status: 'pending',
                    utrId : UTR,
                    productId: item.product._id,
                    totalAmount: item.product.price * item.quantity,
                    quantity: item.quantity,
                    sellerId : item.product.sellerId
                };
                
                return axios.post(`${url}/api/order_item`, orderData, {
                    headers: { token }
                });

                setUTR('')
            });

            const orderResponses = await Promise.all(orderPromises);
            const allSuccessful = orderResponses.every(response => response.status === 200);

            if (allSuccessful) {
                toast.success('Order placed successfully');
            } else {
                toast.error('Failed to place order');
            }
        } catch (error) {
            console.error('Payment error:', error);
            if (error.response) {
                console.error('Response Data:', error.response.data);
            }
            toast.error('Payment error');
        }
    };

    return (
        <div>
            {token ? (
                <div className="payment">
                    <div className="container">
                        <div className="itemSection">
                            {products.length === 0 ? (
                                <span>No Products</span>
                            ) : (
                                <div className='items'>
                                    {products.map((item) => (
                                        <div className="item" key={item.product._id}>
                                            <div className="info">
                                                <span>{item.product.name}</span>
                                                <div className="price">
                                                    <FaRupeeSign />
                                                    <span>{item.product.price}</span>
                                                </div>
                                                
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="total">
                                <span>Total Amount: {getTotalPrice()}</span>
                            </div>
                        </div>
                        {showPayment &&
                            <div className="paymentSection">
                                {accountDetails.map((item, index) => (
                                    <div className="form" key={item.product?.id || index}>
                                        <form onSubmit={handleOrder}>
                                            <div className="inputFields">
                                                <label>
                                                    Bank Name
                                                    <input type="text" defaultValue={item.bankAccountDetails?.bankName} readOnly />
                                                </label>
                                                <label>
                                                    Account Number
                                                    <input type="text" defaultValue={item.bankAccountDetails?.accountNumber} readOnly />
                                                </label>
                                                <label>
                                                    IFSC Code
                                                    <input type="text" defaultValue={item.bankAccountDetails?.ifscCode} readOnly />
                                                </label>
                                                <input type="text" className='utr' placeholder='Enter UTR ID'  onChange={(e) => setUTR(e.target.value)}/>
                                            </div>
                                            <div className="Btn">
                                                <button >ORDER NOW</button>
                                            </div>
                                        </form>
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                    <ToastContainer />
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
}

export default Payment;

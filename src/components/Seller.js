import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Seller.css';
import { SellerDataContext } from './SellerData';
import { FaUser, FaAddressCard } from "react-icons/fa";
import { AiTwotoneBank } from "react-icons/ai";
import { url } from '../middlewares/Urls';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Seller = () => {
    const { sellerData, setSellerData } = useContext(SellerDataContext);
    const [productShow, setProductShow] = useState(true);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showOrder, setShowOrder] = useState(false);
    const [sellerOrders, setSellerOrders] = useState([]);
    const token = localStorage.getItem('token');
    const [editingProductId, setEditingProductId] = useState(null);
    const [updatedProduct, setUpdatedProduct] = useState({});
    const navigate = useNavigate();

    // Get seller ID from seller data
    const sellerId = sellerData.length > 0 ? sellerData[0]._id : null;

    useEffect(() => {
        const getSellerData = async () => {
            if (sellerId) {
                try {
                    const res = await axios.get(`${url}/api/get_seller/${sellerId}`);
                    console.log('API response data:', res.data);
                    if (Array.isArray(res.data)) {
                        setSellerData(res.data);
                    } else if (res.data) {
                        setSellerData([res.data]);
                    } else {
                        console.log('Unexpected Data Format');
                    }
                } catch (error) {
                    console.log('Error fetching seller data:', error);
                    setError('Error fetching seller data');
                }
            }
        };
        getSellerData();
    }, [sellerId]);

    useEffect(() => {
        const fetchSellerProducts = async () => {
            if (productShow && sellerId) {
                setLoading(true);
                setError('');
                try {
                    const response = await axios.get(`${url}/api/seller_products/${sellerId}`);
                    setProducts(response.data);
                } catch (error) {
                    setError("There was an error fetching the specific seller data!");
                    console.error('Error fetching products:', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchSellerProducts();
    }, [productShow, sellerId]);

    useEffect(() => {
        const getSellerOrders = async () => {
            if (showOrder && sellerId) {
                setError('');
                setLoading(true);
                try {
                    const response = await axios.get(`${url}/api/seller/${sellerId}`);
                    console.log('Fetched orders:', response.data);
                    if (Array.isArray(response.data)) {
                        console.log('your order data is',response.data)
                        setSellerOrders(response.data);
                    } else {
                        console.log('Unexpected Data Format');
                    }
                } catch (error) {
                    setError("There was an error fetching the seller orders!");
                    console.error('Error fetching orders:', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        getSellerOrders();
    }, [showOrder, sellerId]);

    const handleShowProduct = () => {
        setProductShow(true);
        setShowOrder(false);
    };

    const handleShowOrder = () => {
        setShowOrder(true);
        setProductShow(false);
    };

    const handleDeleteClick = async (productId) => {
        try {
            await axios.delete(`${url}/api/product/${productId}`);
            setProducts(products.filter(product => product._id !== productId));
            toast.success('Product deleted successfully');
        } catch (error) {
            console.error('There was an error deleting the product:', error);
            setError('There was an error deleting the product.');
            toast.error('There was an error deleting the product.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleEditClick = (product) => {
        setEditingProductId(product._id);
        setUpdatedProduct(product);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProduct({ ...updatedProduct, [name]: value });
    };

    const handleSaveClick = async () => {
        try {
            const response = await axios.put(`${url}/api/update-item/${editingProductId}`, updatedProduct);
            if (response.status === 200) {
                setProducts(products.map(product => product._id === editingProductId ? { ...product, ...updatedProduct } : product));
                setEditingProductId(null);
                toast.success('Product updated successfully');
            } else {
                toast.error('Failed to update product');
            }
        } catch (error) {
            console.error('There was an error updating the product:', error);
            setError('There was an error updating the product.');
            toast.error('There was an error updating the product.');
        }
    };

    const handleCancelOrder = async (productId) => {
        try {
            const currentSellerId = sellerData.length > 0 ? sellerData[0]._id : null;
            if (!productId || !currentSellerId) {
                toast.error('Missing product ID or seller ID.');
                return;
            }

            const requestData = {
                productId,
                sellerId: currentSellerId,
            };

            const response = await axios.delete(`${url}/api/cancel_order`, {
                data: requestData
            });

            if (response.status === 200) {
                toast.success('Order Canceled Successfully');
                setSellerOrders(sellerOrders.filter(order => order.productId !== productId));
            } else {
                toast.error('Order Not Canceled');
            }
        } catch (error) {
            console.log('Error At Cancel The Order', error);
            toast.error('There was an error canceling the order.');
        }
    };

    return (
        <div>
            <div>
                {token ? (
                    sellerData.length !== 0 ? (
                        <div className="seller">
                            <div className="container">
                                <div className="sideNav">
                                    <ul>
                                        {sellerData.map((item, index) => (
                                            <React.Fragment key={index}>
                                                <li onClick={handleShowProduct} className='buttons'>Your Products</li>
                                                <li onClick={handleShowOrder} className='buttons'>Your Orders</li>
                                                <Link to={'/productForm'}>
                                                    <li className='buttons'>Add Products</li>
                                                </Link>
                                                <div className='head'>
                                                    <div className="icon">
                                                        <span className='icon'><FaUser /></span>
                                                        <span>USER INFO</span>
                                                    </div>
                                                    <ul>
                                                        <li>{item.firstName}</li>
                                                        <li>{item.lastName}</li>
                                                        <li>{item.mobileNumber}</li>
                                                    </ul>
                                                    <div className="head">
                                                        <div className="icon">
                                                            <span><FaAddressCard /></span>
                                                            <span>ADDRESS DETAILS</span>
                                                        </div>
                                                        <ul>
                                                            <li>{item.address?.area || 'N/A'}</li>
                                                            <li>{item.address?.village || 'N/A'}</li>
                                                            <li>{item.address?.city || 'N/A'}</li>
                                                            <li>{item.address?.state || 'N/A'}</li>
                                                        </ul>
                                                    </div>
                                                    <div className="head">
                                                        <div className="icon">
                                                            <span className='icon'><AiTwotoneBank /></span>
                                                            <span>BANK DETAILS</span>
                                                        </div>
                                                        <ul>
                                                            <li>{item.bankAccountDetails.bankName}</li>
                                                            <li>{item.bankAccountDetails.accountNumber}</li>
                                                            <li>{item.bankAccountDetails.ifscCode}</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        ))}
                                        <li className='logout' onClick={handleLogout}>Logout</li>
                                    </ul>
                                </div>
                                <div className="sales">
                                    {/* <div className="topSection">
                                        <div>
                                            <span>TODAY ORDERS</span>
                                            <span>$30</span>
                                        </div>
                                        <div>
                                            <span>THIS WEEK ORDERS</span>
                                            <span>$114</span>
                                        </div>
                                        <div>
                                            <span>TOTAL INCOME</span>
                                            <span>$90,566</span>
                                        </div>
                                    </div> */}
                                    <div className="orders">
                                        <div className='items'>
                                            {productShow && (
                                                <div className="products">
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th>Product Name</th>
                                                                <th>Price</th>
                                                                <th>Original Price</th>
                                                                <th>Quantity</th>
                                                                <th>Category</th>
                                                                <th>Update</th>
                                                                <th>Delete</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {products.map((item, index) => (
                                                                <tr key={index}>
                                                                    <td>
                                                                        {editingProductId === item._id ? (
                                                                            <input
                                                                                type="text"
                                                                                name="name"
                                                                                value={updatedProduct.name || item.name}
                                                                                onChange={handleInputChange}
                                                                            />
                                                                        ) : (
                                                                            item.name
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {editingProductId === item._id ? (
                                                                            <input
                                                                                type="text"
                                                                                name="price"
                                                                                value={updatedProduct.price || item.price}
                                                                                onChange={handleInputChange}
                                                                            />
                                                                        ) : (
                                                                            item.price
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {editingProductId === item._id ? (
                                                                            <input
                                                                                type="text"
                                                                                name="originalPrice"
                                                                                value={updatedProduct.originalPrice || item.originalPrice}
                                                                                onChange={handleInputChange}
                                                                            />
                                                                        ) : (
                                                                            item.originalPrice
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {editingProductId === item._id ? (
                                                                            <input
                                                                                type="text"
                                                                                name="quantity"
                                                                                value={updatedProduct.quantity || item.quantity}
                                                                                onChange={handleInputChange}
                                                                            />
                                                                        ) : (
                                                                            item.quantity
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {editingProductId === item._id ? (
                                                                            <input
                                                                                type="text"
                                                                                name="category"
                                                                                value={updatedProduct.category || item.category}
                                                                                onChange={handleInputChange}
                                                                            />
                                                                        ) : (
                                                                            item.category
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {editingProductId === item._id ? (
                                                                            <button className="save" onClick={handleSaveClick}>
                                                                                Save
                                                                            </button>
                                                                        ) : (
                                                                            <button className=" update" onClick={() => handleEditClick(item)}>
                                                                                Update
                                                                            </button>
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        <button className=" delete" onClick={() => handleDeleteClick(item._id)}>
                                                                            Delete
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                            {showOrder && (
                                                <div className="order">
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th>Order ID</th>
                                                                <th>Product Name</th>
                                                                <th>Quantity</th>
                                                                <th>Total Amount</th>
                                                                <th>Status</th>
                                                                <th>Cancel</th>
                                                                <th>Confirm</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                        {sellerOrders.map((order, index) => (
                                                                <React.Fragment key={index}>
                                                                    {order.items.map((item, itemIndex) => (
                                                                        <tr key={itemIndex}>
                                                                            <td>{item.productId.name || 'Unknown Product'}</td>
                                                                            <td>{item.price}</td>
                                                                            <td>{item.quantity}</td>
                                                                            <td>{order.totalAmount}</td>
                                                                            <td>{order.status || 'Pending'}</td>
                                                                            <td>
                                                                                <button className="btn btn-red" onClick={() => handleCancelOrder(order._id)}>
                                                                                    Cancel
                                                                                </button>
                                                                            </td>
                                                                            <td>
                                                                                <button className='btn btn-green'> Confirm </button>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </React.Fragment>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                            {loading && <p>Loading...</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='noSeller'>
                            <span>Sorry your not a seller</span>
                            <span>Please register as a seller first <Link to={'/seller-form'}>seller</Link></span>
                        </div>
                    )
                ) : (
                    <div className='auth'>
                        <span>There Is An Authentication Issue</span>
                        <span>Please Login Again</span>
                        <Link to={'/login'}><button>Login Page</button></Link>
                    </div>
                )}
                <ToastContainer />
            </div>
        </div>
    );
};

export default Seller;

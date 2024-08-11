import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ToastContainer,toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import {url} from '../middlewares/Urls'
import '../styles/Wishlist.css'

const Wishlist = () => {
    const token = localStorage.getItem('token')

    const [wishListItem,setWishListItem] = useState([])

    useEffect(()=>{
        const getItem = async()=>{
            try {
                let res = await axios.get(`${url}/api/wishlist_items`,{
                    headers:{
                        token:token
                    }
                })

                if(Array.isArray(res.data)){
                    setWishListItem(res.data)
                }else{
                    console.log('data type is ',typeof(res.data))
                }
            } catch (error) {
                console.log('Error at fetching data')
            }
        }
        getItem()
    },[token])

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

    const handleItemRemove = async (productId) => {
        try {
            let res = await axios.delete('http://localhost:5000/api/remove-wishlist-item', {
                data: { productId },
                headers: {
                    token: token
                }
            });
            
            if(res.status === 200){
                toast.success('Item removed')

                let res = await axios.get(`${url}/api/wishlist_items`,{
                    headers:{
                        token:token
                    }
                })

                if(Array.isArray(res.data)){
                    setWishListItem(res.data)
                }else{
                    console.log('data type is ',typeof(res.data))
                }
            }else{
                toast.error('Item not removed')
            }
        } catch (error) {
            console.log('Error at removing item', error);
        }
    }
    


  return (
    <div>
        {token ? (
            <div className='wishlist'>
                <div className='container'>
                    <div className="items">
                        {wishListItem.map((item)=>(
                            <div key={item._id} className='item'>
                                <div className="imageSection">
                                    <img src={`${url}/${item.productId.image}`} />
                                </div>
                                <div className="info">
                                    <span className='name'>{item.productId.name}</span>
                                    <div className="price">
                                        <span>${item.productId.price}</span>
                                        <del><span>${item.productId.originalPrice}</span></del>
                                    </div>
                                </div>
                                <div className="Btn">
                                    <button onClick={()=> handleItemRemove(item.productId._id)}>Remove</button>
                                    <button onClick={()=> handleCart(item.productId._id)}>Add to cart</button>
                                </div>
                            </div>
                        ))}
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
  )
}

export default Wishlist
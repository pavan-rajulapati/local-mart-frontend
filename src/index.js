import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Register from './components/Register';
import Login from './components/Login';
import Section1 from './components/Section1';
import ProductsPage from './components/Product';
import Search from './components/Search';
import Navbar from './components/Navbar';
import ProductForm from './components/ProductForm';
import Cart from './components/Cart';
import User_address from './components/User_address';
import Profile from './components/Profile';
import User_details from './components/User_details';
import Payment from './components/Payment'
import Success from './components/Success';
import { UserAddressProvider } from './components/UserAddress';
import { SellerDataProvider } from './components/SellerData';
import PageNotFound from './components/PageNotFound';
import Seller from './components/Seller';
import Wishlist from './components/Wishlist';
import Cancel from './components/Cancel';
import SellerForm from './components/SellerRegister';
import Hello from './App';

const App = () => {
  const location = useLocation();
  const hideNavbarPaths = ['/register', '/login'];

  return (
    <>
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/app' element={<Hello />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/section' element={<Section1 />} />
        <Route path='/products/:category' element={<ProductsPage />} />
        <Route path='/search/:query' element={<Search />} />
        <Route path='/productForm' element={<ProductForm/> }/>
        <Route path='/cart' element={<Cart/> }/>
        <Route path='/user' element={<User_address/> }/>
        <Route path='/profile' element={<Profile/> }/>
        <Route path='/user_details' element={<User_details/> }/>
        <Route path='/payment' element={<Payment/> }/>
        <Route path='/success' element={<Success/> }/>
        <Route path='/seller' element={<Seller/> }/>
        <Route path='/wishlist' element={<Wishlist/> }/>
        <Route path='/cancel' element={<Cancel/> }/>
        <Route path='/seller-form' element={<SellerForm/> }/>
        <Route path='*' element={<PageNotFound/> }/>
      </Routes>
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserAddressProvider>
        <SellerDataProvider>
          <App />
        </SellerDataProvider>
      </UserAddressProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();

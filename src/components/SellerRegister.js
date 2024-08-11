import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/SellerRegister.css';
import { url } from '../middlewares/Urls';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const SellerForm = () => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        mobileNumber: '',
        address: {
          area: '',
          village: '',
          city: '',
          state: ''
        },
        bankAccountDetails: {
          bankName: '',
          accountNumber: '',
          ifscCode: ''
        }
    });

  const handleChange = (e) => {
      const { name, value } = e.target;
      const [parent, child] = name.includes('.') ? name.split('.') : [null, name];

      if (parent) {
        setFormData((prevData) => ({
          ...prevData,
          [parent]: { ...prevData[parent], [child]: value }
        }));
      } else {
        setFormData((prevData) => ({ ...prevData, [child]: value }));
      }
  };

  const validateFields = () => {
      const { address, bankAccountDetails } = formData;

      if (
        Object.values(address).some((field) => field === '') ||
        Object.values(bankAccountDetails).some((field) => field === '')
      ) {
        return 'Fields should not be empty';
      }

      if (
        bankAccountDetails.accountNumber.length < 8 ||
        bankAccountDetails.accountNumber.length > 12
      ) {
        return 'Enter a valid account number';
      }

      return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateFields();
    if (validationError) {
      toast.error(validationError);
      return;
    }
  
    try {
      const res = await axios.post(`${url}/api/seller`, formData, {
        headers: {
          token : token 
        },
      });
  
      if (res.status === 200) {
        toast.success('Seller registered successfully');
        navigate('/seller-dashboard'); 
      } else if (res.status === 409) {
        toast.error(res.data.message);
      } else {
        toast.error('Unexpected error occurred');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error submitting form');
    }
  };
  

  return (
    <div className="seller-form">
      {token ? (
        <form onSubmit={handleSubmit}>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" />
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />
          <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder="Mobile Number" />
          <input type="text" name="address.area" value={formData.address.area} onChange={handleChange} placeholder="Area" />
          <input type="text" name="address.village" value={formData.address.village} onChange={handleChange} placeholder="Village" />
          <input type="text" name="address.city" value={formData.address.city} onChange={handleChange} placeholder="City" />
          <input type="text" name="address.state" value={formData.address.state} onChange={handleChange} placeholder="State" />
          <input type="text" name="bankAccountDetails.bankName" value={formData.bankAccountDetails.bankName} onChange={handleChange} placeholder="Bank Name" />
          <input type="text" name="bankAccountDetails.accountNumber" value={formData.bankAccountDetails.accountNumber} onChange={handleChange} placeholder="Account Number" />
          <input type="text" name="bankAccountDetails.ifscCode" value={formData.bankAccountDetails.ifscCode} onChange={handleChange} placeholder="IFSC Code" />
          <button type="submit">Submit</button>
        </form>
      ) : 
      (
        <div className='auth'>
              <span>There Is An Authentication Issue</span>
              <span>Please Login Again</span>
              <Link to={'/login'}><button>Login Page</button></Link>
        </div>
      )}
      <ToastContainer/>
    </div>
  );
};

export default SellerForm;

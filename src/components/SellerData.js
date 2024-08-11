import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { url } from '../middlewares/Urls'; // Ensure this import path is correct

export const SellerDataContext = createContext();

export const SellerDataProvider = ({ children }) => {
  const token = localStorage.getItem('token');
  const [sellerData, setSellerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSellerData = async () => {
      if (token) {
        try {
          setLoading(true);
          setError(null);
          const res = await axios.get(`${url}/api/get_seller`, {
            headers: { token },
          });

          if (res.data) {
            setSellerData(Array.isArray(res.data) ? res.data : [res.data]);
          } else {
            console.log('Unexpected Data Format');
          }
        } catch (error) {
          console.error('Error fetching seller data:', error);
          setError('Failed to fetch seller data');
        } finally {
          setLoading(false);
        }
      }
    };

    getSellerData();
  }, [token]);

  return (
    <SellerDataContext.Provider value={{ sellerData,setSellerData, loading, error }}>
      {children}
    </SellerDataContext.Provider>
  );
};

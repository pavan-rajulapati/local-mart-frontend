import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { url } from '../middlewares/Urls';

export const UserAddressContext = createContext();

export const UserAddressProvider = ({ children }) => {
    const token = localStorage.getItem('token');
    const [userAddress, setUserAddress] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserAddress = async () => {
            try {
                const response = await axios.get(`${url}/api/user_address`, {
                    headers: {
                        token: token
                    }
                });
                if(response.data.status === 404){
                    console.log('there is no data')
                }
                setUserAddress(response.data);
            } catch (error) {
                console.error('Error fetching user address:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserAddress();
    }, [token]);

    return (
        <UserAddressContext.Provider value={{ userAddress, loading }}>
            {children}
        </UserAddressContext.Provider>
    );
};

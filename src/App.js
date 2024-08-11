// Dashboard.js
import React, { useContext, useEffect } from 'react';
import { SellerDataContext } from './components/SellerData';

const Dashboard = () => {
    const { sellerData } = useContext(SellerDataContext);

    useEffect(() => {
        if (sellerData && sellerData.sellerId) {
            console.log('Seller Data:', sellerData);
            // You can now use the seller data as needed
        }
    }, [sellerData]);

    return (
        <div>
            <h1>Welcome, Seller ID: {sellerData.sellerId}</h1>
            {/* Display more seller-specific data here */}
        </div>
    );
};

export default Dashboard;

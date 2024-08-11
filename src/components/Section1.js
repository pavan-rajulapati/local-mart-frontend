import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Section1.css';

const Section1 = () => {
    const navigate = useNavigate();

    const navigateToCategory = (category) => {
        navigate(`/products/${category}`);
    };

    return (
        <div>
            <div className="section1">
                <div className="container">
                    <div className="cards">
                        <div className="card" onClick={() => navigateToCategory('vehicle')}>
                            <div className='image'>
                                <img src="images/cycle1.png" alt="cycle" />
                            </div>
                            <div className="info">
                                <p>Latest gears cycle with best offer</p>
                                <span>up to 40% off</span>
                            </div>
                        </div>
                        <div className="card" onClick={() => navigateToCategory('sports')}>
                            <div className='image'>
                                <img src="images/bat1-removebg-preview.png" alt="bat" />
                            </div>
                            <div className="info">
                                <p>Strauss Power | Suitable Only for Tennis Ball</p>
                                <span>up to 60% off</span>
                            </div>
                        </div>
                        <div className="card" onClick={() => navigateToCategory('electronics')}>
                            <div className='image'>
                                <img src="images/mouse2-removebg-preview.png" alt="mouse" />
                            </div>
                            <div className="info">
                                <p>Ambidextrous Wireless Optical Mouse</p>
                                <span>up to 40% off</span>
                            </div>
                        </div>
                        <div className="card" onClick={() => navigateToCategory('electronics')}>
                            <div className='image'>
                                <img src="images/ac1-removebg-preview.png" alt="ac" />
                            </div>
                            <div className="info">
                                <p>1.5 Ton 3 Star Split Inverter AC with PM 2.5 Filter</p>
                                <span>up to 25% off</span>
                            </div>
                        </div>
                        <div className="card" onClick={() => navigateToCategory('electronics')}>
                            <div className='image'>
                                <img src="images\fridge4-removebg-preview.png" alt="ac" />
                            </div>
                            <div className="info">
                                <p>5 star new model double door fridge for summer</p>
                                <span>up to 15% off</span>
                            </div>
                        </div>
                        <div className="card" onClick={() => navigateToCategory('women ware')}>
                            <div className='image'>
                                <img src="images\saree1-removebg-preview.png" alt="ac" />
                            </div>
                            <div className="info">
                                <p>latest model pattu sarees for women</p>
                                <span>up to 55% off</span>
                            </div>
                        </div>
                        <div className="card" onClick={() => navigateToCategory('furniture')}>
                            <div className='image'>
                                <img src="images\sofa1-removebg-preview.png" alt="ac" />
                            </div>
                            <div className="info">
                                <p>new model sofa set for home designing</p>
                                <span>up to 30% off</span>
                            </div>
                        </div>
                        <div className="card" onClick={() => navigateToCategory('mobiles')}>
                            <div className='image'>
                                <img src="images/mobile1-removebg-preview.png" alt="ac" />
                            </div>
                            <div className="info">
                                <p>5g latest mobiles under 15k grab now</p>
                                <span>up to 30% off</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Section1;

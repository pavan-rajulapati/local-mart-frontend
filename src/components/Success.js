import React from 'react'
import {Link} from 'react-router-dom'
import '../styles/success.css'

const Success = () => {
  return (
    <div>
        <div className="success">
          <span>Order confirmed successfully</span>
          <span>Go to the dashboard or home page</span>
          <Link to={'/'}><button>Home Page</button></Link>
        </div>
    </div>
  )
}

export default Success
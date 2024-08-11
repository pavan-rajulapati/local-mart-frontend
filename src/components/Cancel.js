import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/success.css'

const Cancel = () => {
  return (
    <div>
        <div className="cancel">
          <span>Failed at confirming Order</span>
          <span>Please order again</span>
          <Link to={'/cart'}><button>Cart Section</button></Link>
        </div>
    </div>
  )
}

export default Cancel
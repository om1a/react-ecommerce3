import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userToken = localStorage.getItem('userToken');
        const response = await axios.get('https://ecommerce-node4.vercel.app/order', {
          headers: {
            Authorization: `Tariq__${userToken}`,
          },
        });
        if (response.data && response.data.orders) {
          setOrders(response.data.orders);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h2>User Orders</h2>
      <div>
        {orders.map((order) => (
          <div key={order._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <h3>Order ID: {order._id}</h3>
            <p>Final Price: ${order.finalPrice}</p>
            <p>Address: {order.address}</p>
            <p>Phone Number: {order.phoneNumber}</p>
            <p>Payment Type: {order.paymentType}</p>
            <p>Status: {order.status}</p>
            <p>Order Date: {order.createdAt}</p>
            <div>
              <h4>Products:</h4>
              {order.products.length > 0 ? (
                order.products.map((product) => (
                  <div key={product._id}>
                    <p>Product ID: {product.productId}</p>
                    <p>Quantity: {product.quantity}</p>
                    <p>Unit Price: ${product.unitPrice}</p>
                    <p>Final Price: ${product.finalPrice}</p>
                  </div>
                ))
              ) : (
                <p>No products</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

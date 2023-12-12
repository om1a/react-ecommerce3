import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/Cart.jsx";

export default function Order() {
  const { getCartContext } = useContext(CartContext);
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      const cartContext = await getCartContext();
      if (cartContext && cartContext.products) {
        setCartData(cartContext.products);
      }
    };
    fetchCartItems();
  }, [getCartContext]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("userToken");
      await axios.post(
        "https://ecommerce-node4.vercel.app/order",
        {
          address,
          phone,
          cartItems: [],
        },
        {
          headers: {
            Authorization: `Tariq__${token}`,
          },
        }
      );
      navigate('/');
    } catch (error) {
      console.error("Error", error);
    }
  };

  return (
    <div className="container mt-5">
      <div>
        <h2>Your Cart Items</h2>
        <div className="row">
          {cartData.length > 0 ? (
            cartData.map((item, index) => (
              <div key={index} className="col-md-4 mb-3">
                <img src={item.details.mainImage.secure_url} alt={item.details.name} className="img-fluid" />
                <p>{item.details.name}</p>
                <p>Price: ${item.details.price}</p>
              </div>
            ))
          ) : (
            <p>Your cart is empty</p>
          )}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            id="phone"
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

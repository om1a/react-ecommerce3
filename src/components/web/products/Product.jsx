import axios from "axios";
import React, { useContext, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/Cart.jsx";
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NumericRating = ({ rating }) => {
  return <div className="badge bg-secondary">{rating} / 5</div>;
};

export default function Product() {
  const { productId } = useParams();
  const { addToCartContext } = useContext(CartContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  const getProduct = async () => {
    const { data } = await axios.get(
      `https://ecommerce-node4.vercel.app/products/${productId}`
    );
    return data.product;
  };

  const { data, isLoading } = useQuery("product", getProduct);

  const addToCart = async (productId) => {
    await addToCartContext(productId);
  };
  const submitReview = async () => {
    try {
      const token = localStorage.getItem("userToken");

      const response = await axios.post(
        `https://ecommerce-node4.vercel.app/products/${productId}/review`,
        { comment, rating },
        { headers: { Authorization: `Tariq__${token}` } }
      );

      if (response.data.message === "success") {
        toast("Review submitted successfully!", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          theme: "dark",
        });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("already reviewed this product .", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "dark",
      });
    }
  };
  if (isLoading) {
    return <div className="text-center p-5"><span className="spinner-border text-primary"></span></div>;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          {data.subImages.map((img, index) => (
            <img
              key={index}
              src={img.secure_url}
              alt={`Product ${index}`}
              className="img-fluid mb-2"
              style={{ maxWidth: "80%", height: "auto", border: "1px solid #ddd", marginBottom: "10px" }}
            />
          ))}
        </div>
        <div className="col-md-6">
          <h2 className="fw-bold">{data.name}</h2>
          <p className=""><span className="fw-bold" style={{ color: 'red' }}>${data.finalPrice}</span></p>
          <p>{data.description}</p>
          <button
            className="btn btn-danger mt-3"
            onClick={() => addToCart(data._id)}
          >
            Add To Cart
          </button>
          <div className="mt-4">
            <h3>Product Reviews</h3>
            {data.reviews.length > 0 ? (
              data.reviews.map((review, index) => (
                <div key={index} className="mb-3">
                  <strong>{review.createdBy.userName}</strong>
                  <NumericRating rating={review.rating} />
                  <p>{review.comment}</p>
                </div>
              ))
            ) : (
              <p>No reviews available.</p>
            )}
          </div>
          <div className="mt-4">
            <form onSubmit={(e) => {
                e.preventDefault();
                submitReview();
              }}>
              <div className="mb-3">
                <label htmlFor="comment" className="form-label">Review:</label>
                <textarea
                  id="comment"
                  className="form-control"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="rating" className="form-label">Rating:</label>
                <select
                  id="rating"
                  className="form-select"
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value, 10))}
                  required
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
              <button type="submit" className="btn btn-danger" >Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
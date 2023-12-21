import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";

export default function CategoryDetails() {
  const { categoryId } = useParams();

  const getCategoriesDetailes = async () => {
    const { data } = await axios.get(`https://ecommerce-node4.vercel.app/products/category/${categoryId}`);
    return data.products;
  };

  const { data, isLoading } = useQuery("category_details", getCategoriesDetailes);

  if (isLoading) {
    return <p>Loading....</p>;
  }

  return (
    <div className="container mt-4">
      {data.length ? (
        <ul className="list-unstyled">
          {data.map((product) => (
            <li key={product._id} className="mb-3">
              <div className="d-flex align-items-center">
                <img
                  src={product.mainImage.secure_url}
                  style={{ width: "200px", height: "300px", marginRight: "20px" }}
                  alt={product.name}
                />
                <div>
                  <h5>{product.name}</h5>
                  <Link to={`/product/${product._id}`} className="btn btn-danger">
                    Details
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <h2>No products found in this category</h2>
      )}
    </div>
  );
}

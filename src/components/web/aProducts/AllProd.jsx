import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const ProductsPage = 4;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function AllProd() {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const thisPage = parseInt(useQuery().get('page') || '1', 10);

  useEffect(() => {
    setIsLoading(true);
    axios.get(`https://ecommerce-node4.vercel.app/products?page=${thisPage}&limit=${ProductsPage}`)
      .then(response => {
        const { products, total } = response.data;
        setProducts(products);
        setTotalProducts(total);
      })
      .catch(error => console.error('Error:', error))
      .finally(() => setIsLoading(false));
  }, [thisPage]);

  return (
    <div className='container mt-5'>
      <h1>All Products</h1>
      {isLoading ? <p>Loading...</p> : (
        <div className='list-group'>
          {products.map(product => (
            <div key={product._id} className='list-group-item'>
              <img src={product.mainImage.secure_url} alt={product.name}
                style={{ width: '150px', height: '150px', marginRight: '15px' }} />
              <span>{product.name}</span> - <span>${product.finalPrice}</span>
              <Link to={`/product/${product._id}`} className='btn btn-danger ml-3'>
                Details
              </Link>
            </div>
          ))}
        </div>
      )}
      <ReactPaginate
        pageCount={Math.ceil(totalProducts / ProductsPage)}
        onPageChange={({ selected }) => navigate(`?page=${selected + 1}`)}
        containerClassName='pagination'
        activeClassName='active'
        pageClassName='page-item'
        pageLinkClassName='page-link'
        breakClassName='page-item'
        breakLinkClassName='page-link'
        forcePage={thisPage - 1}
        previousLabel=''
        nextLabel=''
      />
    </div>
  );
}

export default AllProd;

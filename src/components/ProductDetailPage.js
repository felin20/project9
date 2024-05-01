import React from 'react';
import { useParams } from 'react-router-dom';


function ProductDetailPage() {
  // Dummy product data
  const products = [
    { id: 1, name: 'Product 1', price: 10, description: 'Description for Product 1' },
    { id: 2, name: 'Product 2', price: 20, description: 'Description for Product 2' },
    { id: 3, name: 'Product 3', price: 30, description: 'Description for Product 3' },
  ];

  const { id } = useParams();
  const product = products.find(product => product.id === parseInt(id));

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <h1>Product Detail Page</h1>
      <h2>{product.name}</h2>
      <p>${product.price}</p>
      <p>{product.description}</p>
    </div>
  );
}

export default ProductDetailPage;

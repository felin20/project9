import React from 'react';

function CustomDialog({ isOpen, onClose, product }) {
  return (
    isOpen && (
      <div className="custom-dialog">
        <div className="custom-dialog-content">
          <h2>{product.title}</h2>
          <p>{product.description}</p>
          <p>Price: {product.price}</p>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    )
  );
}

export default CustomDialog;

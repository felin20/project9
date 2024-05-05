import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, TextField, FormLayout, Button } from '@shopify/polaris';
import { useImageContext } from './ImageContext';
import ImageUpload from './ImageUpload';

function AddProductModal({ open, onClose, onAddProduct }) {
  const { imageURL } = useImageContext();
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    description: '',
    rating: {
      rate: '',
      count: ''
    }
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      // If field is nested, split it and update accordingly
      const [parentField, nestedField] = field.split('.');
      setFormData({
        ...formData,
        [parentField]: {
          ...formData[parentField],
          [nestedField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [field]: value
      });
    }
    // Clear error message when user starts typing again
    setErrorMessage('');
  };

  const handleSubmit = () => {
    const { title, price, category, description, rating } = formData;
    if (!title || !price || !category || !description || !rating.rate || !rating.count || !imageURL) {
      setErrorMessage('Please fill in all fields and upload an image');
      return;
    }

    if (isNaN(Number(price)) || isNaN(Number(rating.rate)) || isNaN(Number(rating.count))) {
      setErrorMessage('Price, rate, and count must be numbers');
      return;
    }

    if (Number(price) < 0 || Number(rating.rate) < 0 || Number(rating.count) < 0) {
      setErrorMessage('Price, rate, and count must be non-negative');
      return;
    }

    const newProduct = {
      id: generateNewProductId(),
      image: imageURL,
      ...formData
    };

    onAddProduct(newProduct);
    onClose();
    resetForm();
  };

  const generateNewProductId = () => {
    // Generate new product ID logic
  };

  const resetForm = () => {
    setFormData({
      title: '',
      price: '',
      category: '',
      description: '',
      rating: {
        rate: '',
        count: ''
      }
    });
    // Provide feedback to the user that the product was added successfully
    setErrorMessage('Product added successfully!');
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Product"
    >
      <Modal.Section>
        <FormLayout>
          <ImageUpload />
          <TextField
            label="Title"
            value={formData.title}
            onChange={(value) => handleChange('title', value)}
            required
          />
          <TextField
            label="Price"
            type="number"
            value={formData.price}
            onChange={(value) => handleChange('price', value)}
            placeholder="Enter price"
            error={errorMessage.includes('Price')}
            required
          />
          <TextField
            label="Category"
            value={formData.category}
            onChange={(value) => handleChange('category', value)}
            placeholder="Enter category"
            required
          />
          <TextField
            label="Description"
            value={formData.description}
            onChange={(value) => handleChange('description', value)}
            placeholder="Enter description"
            required
          />
          <TextField
            label="Rate"
            type="number"
            value={formData.rating.rate}
            onChange={(value) => handleChange('rating.rate', value)}
            placeholder="Enter rate"
            error={errorMessage.includes('Rate')}
            required
          />
          <TextField
            label="Count"
            type="number"
            value={formData.rating.count}
            onChange={(value) => handleChange('rating.count', value)}
            placeholder="Enter count"
            error={errorMessage.includes('Count')}
            required
          />
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <Button primary onClick={handleSubmit}>Add Product</Button>
        </FormLayout>
      </Modal.Section>
    </Modal>
  );
}

AddProductModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddProduct: PropTypes.func.isRequired,
};

export default AddProductModal;

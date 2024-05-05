import React, { useState,useRef } from 'react';
import PropTypes from 'prop-types';
import { Modal, TextField, FormLayout, Button } from '@shopify/polaris';
import { useImageContext } from './ImageContext';
import DefaultImage from "../assets/upload-photo-here.png";
import EditIcon from "../assets/edit.svg";
import UploadingAnimation from "../assets/uploading.gif";
import { ImageContext } from './ImageContext';



const ImageUpload = ({ visible }) => {
  const { setImage } = useImageContext();
  const [avatarURL, setAvatarURL] = useState(DefaultImage);
  const fileUploadRef = useRef();

  const handleImageUpload = (event) => {
    event.preventDefault();
    fileUploadRef.current.click();
  };

  const uploadImageDisplay = async () => {
    try {
      setAvatarURL(UploadingAnimation);
      const uploadedFile = fileUploadRef.current.files[0];
      const formData = new FormData();
      formData.append("file", uploadedFile);
      
      const response = await fetch("https://api.escuelajs.co/api/v1/files/upload", {
        method: "post",
        body: formData
      });

      if (response.status === 201) {
        const data = await response.json();
        setAvatarURL(data?.location);
        setImage(data?.location); // Set image in context
      }

    } catch(error) {
      console.error(error);
      setAvatarURL(DefaultImage);
    }
  };

  if (!visible) return null;

  return (
    <div className="relative h-96 w-96 m-8">
      <form id="form" encType='multipart/form-data'>
        <button
          type='submit'
          onClick={handleImageUpload}
          className='flex-center absolute bottom-12 right-14 h-9 w-9 rounded-full'
        >
          <img style={{width:'5px',height:'5px'}}
            src={EditIcon}
            alt="Edit"
            className='object-cover'
          />
        </button>
        <input 
          type="file"
          id="file"
          ref={fileUploadRef}
          onChange={uploadImageDisplay}
          hidden
        />
      </form>  
    </div>
  );
}


function AddProductModal({ open, onClose, onAddProduct }) {
  const { imageURL } = useImageContext();
  const [formData, setFormData] = useState({
    image:'',
    title: '',
    price: '',
    category: '',
    description: '',
    rate: '',
    count: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = () => {
    const { title, price, category, description, rate, count } = formData;
    if (!title || !price || !category || !description || !rate || !count || !imageURL) {
      setErrorMessage('Please fill in all fields and upload an image');
      return;
    }

    if (isNaN(Number(price)) || isNaN(Number(rate)) || isNaN(Number(count))) {
      setErrorMessage('Price, rate, and count must be numbers');
      return;
    }

    if (Number(price) < 0 || Number(rate) < 0 || Number(count) < 0) {
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
      image:'',
      title: '',
      price: '',
      category: '',
      description: '',
      rate: '',
      count: ''
    });
    setErrorMessage('');
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Product"
    >
      <Modal.Section>
        <FormLayout>
         <p style={{fontSize:'20px',fontWeight:'600'}}>Upload Image</p>
          <ImageUpload visible={open} />
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
            required
          />
          <TextField
            label="Category"
            value={formData.category}
            onChange={(value) => handleChange('category', value)}
            required
          />
          <TextField
            label="Description"
            value={formData.description}
            onChange={(value) => handleChange('description', value)}
            required
          />
          <TextField
            label="Rate"
            type="number"
            value={formData.rate}
            onChange={(value) => handleChange('rate', value)}
            required
          />
          <TextField
            label="Count"
            type="number"
            value={formData.count}
            onChange={(value) => handleChange('count', value)}
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

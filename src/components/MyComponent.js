import React from 'react';
import { useImageContext } from './ImageContext';

const MyComponent = () => {
  const { image, updateImage } = useImageContext(); // Destructure updateImage from the context

  const handleImageChange = (event) => {
    const newImage = event.target.files[0];
    updateImage(newImage); // Use updateImage instead of setImage
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      {image && (
        <div>
          <h2>Preview:</h2>
          <img src={URL.createObjectURL(image)} alt="Preview" />
        </div>
      )}
    </div>
  );
};

export default MyComponent;

import React from 'react';
import { useImage } from './ImageContext';

const DisplayImage = () => {
  const { image } = useImage();

  return (
    <div>
      {image && <img src={URL.createObjectURL(image)} alt="Uploaded" />}
    </div>
  );
};

export default DisplayImage;

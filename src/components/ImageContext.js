import React, { createContext, useState, useContext } from 'react';

const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [imageURL, setImageURL] = useState('');

  const setImage = (newImage) => {
    setImageURL(newImage);
  };

  return (
    <ImageContext.Provider value={{ imageURL, setImage }}>
      {children}
    </ImageContext.Provider>
  );
};

export const useImageContext = () => useContext(ImageContext);


// // ImageContext.js

// import React, { createContext, useState, useContext } from 'react';
// import DefaultImage from "../assets/upload-photo-here.png"; // Import your default image here

// const ImageContext = createContext();

// export const ImageProvider = ({ children }) => {
//   const [imageURL, setImageURL] = useState(DefaultImage);

//   const setImage = (newImage) => {
//     setImageURL(newImage);
//   };

//   return (
//     <ImageContext.Provider value={{ imageURL, setImage }}>
//       {children}
//     </ImageContext.Provider>
//   );
// };

// export const useImage = () => useContext(ImageContext);

import React from 'react';
import PropTypes from 'prop-types';
import { Modal, TextContainer, Card, Badge, Thumbnail } from '@shopify/polaris';

function ProductModal({ open, onClose, productId, products }) {
  const product = products.find(p => p.id === productId);

  if (!product) {
    return (
      <Modal
        open={open}
        onClose={onClose}
        title="Product Not Found"
      >
        <Modal.Section>
          <p>No product found with the specified ID.</p>
        </Modal.Section>
      </Modal>
    );
  }

  // Check if selectedproduct is defined before accessing its properties
  const selectedproduct = product || {};
  const { image, description, price, category, rating, id } = selectedproduct;

  // Check if rating is defined before accessing rate and count
  const { rate, count } = rating || {};

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={selectedproduct.title}
    >
      <Modal.Section>
        <Card sectioned>
          <div className='text6' style={{width:'300px',height:'300px',position:'relative',left:'130px'}}>
          <Thumbnail
            source={selectedproduct.image}
            alt={selectedproduct.title}
            size="x-large"
            
          />
          </div>
          
          
          <TextContainer>
            <p style={{fontWeight:'500',fontSize:'20px',position:'relative',top:'5px'}}>{selectedproduct.description}</p>
            <p><strong>Price:</strong> ${selectedproduct.price}</p>
            <p><strong>Category:</strong> {selectedproduct.category}</p>
            {rate && <p><strong>Rate:</strong> {rate}</p>}
            {count && <p><strong>Count:</strong> {count}</p>}
            <p>
              {/* <Badge>{id}</Badge> */}
            </p>
          </TextContainer>
        </Card>
      </Modal.Section>
    </Modal>
  );
}

ProductModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  productId: PropTypes.number,
  products: PropTypes.array.isRequired,
};

export default ProductModal;

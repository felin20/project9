import React from 'react';
import PropTypes from 'prop-types';
import { Modal, TextContainer, Card, Badge, Thumbnail } from '@shopify/polaris';

function ProductModal({ open, onClose, productId, products }) {
  const product = products.find(p => p.id === productId);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={product ? product.title : ''}
    >
      <Modal.Section>
        {product ? (
          <Card sectioned>
            <Thumbnail
              source={product.image}
              alt={product.title}
              size="large"
            />
            <TextContainer>
              <p>{product.description}</p>
              <p><strong>Price:</strong> ${product.price}</p>
              <p><strong>Category:</strong> {product.category}</p>
              <p><strong>Rate:</strong> {product.rate}</p>
              <p><strong>Count:</strong> {product.count}</p>
              <p>
                <Badge>{product.id}</Badge>
              </p>
            </TextContainer>
          </Card>
        ) : (
          <p>No product found</p>
        )}
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

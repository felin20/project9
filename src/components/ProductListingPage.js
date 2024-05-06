import React, { useState, useEffect } from 'react';
import { Page, Card, DataTable, TextField, ChoiceList, Filters, Banner, EmptyState, Button, Pagination, Icon } from '@shopify/polaris';
import emptyStateImage from './empty-state-image.png'; // Correct path to your image file
import ProductModal from './ProductModal';
import AddProductModal from './AddProductModal';
import { AdjustIcon } from '@shopify/polaris-icons'; // Import AdjustIcon instead of AdjustMinor

function ProductListingPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterValue, setFilterValue] = useState('');
  const [priceRangeFilter, setPriceRangeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products. Please try again later.');
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleRowClick = (productId) => {
    const product = products.find(p => p.id === productId);
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handlePriceRangeChange = (selected) => {
    setPriceRangeFilter(selected[0]);
  };

  const handleCategoryChange = (selected) => {
    setCategoryFilter(selected[0].toLowerCase());
  };

  const handleFilterChange = (value) => {
    setFilterValue(value.toLowerCase());
  };

  const clearFilters = () => {
    setFilterValue('');
    setPriceRangeFilter('');
    setCategoryFilter('');
  };

  const handleAddProduct = (newProduct) => {
    // Increment the IDs of existing products
    const updatedProducts = products.map(product => ({...product, id: product.id + 1 }));
    // Add the new product with ID 1 to the beginning
    setProducts([{
      ...newProduct,
      id: 1
    }, ...updatedProducts]);
  };

  const filteredProducts = products.filter(product => {
    const filterTitle = product.title.toLowerCase().includes(filterValue);
    const filterPrice = priceRangeFilter === '' ||
      (parseFloat(product.price) >= parseFloat(priceRangeFilter.split(' - ')[0]) &&
      parseFloat(product.price) <= parseFloat(priceRangeFilter.split(' - ')[1]));
    const filterCategory = categoryFilter === '' ||
      product.category.toLowerCase() === categoryFilter;
    return filterTitle && filterPrice && filterCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const priceFilterOptions = [
    { label: 'Any', value: '' },
    { label: '$0 - $100', value: '0 - 100' },
    { label: '$100 - $200', value: '100 - 200' },
    { label: '$200 - $1000', value: '200 - 1000' }
  ];

  const categoryFilterOptions = [
    { label: 'Any', value: '' },
    { label: 'Electronics', value: 'electronics' },
    { label: "Men's Clothing", value: "men's clothing" },
    { label: "Women's Clothing", value: "women's clothing" },
    { label: 'Jewelry', value: 'jewelery' },
  ];

  const appliedFilters = [];
  if (priceRangeFilter !== '') {
    appliedFilters.push({
      key: 'priceRange',
      label: `Price Range: ${priceRangeFilter}`,
      onRemove: () => setPriceRangeFilter(''),
    });
  }
  if (categoryFilter !== '') {
    appliedFilters.push({
      key: 'category',
      label: `Category: ${categoryFilter}`,
      onRemove: () => setCategoryFilter(''),
    });
  }

  const closeModal = () => {
    setSelectedProduct(null);
    setModalOpen(false);
  };

  const openAddProductModal = () => {
    setAddProductModalOpen(true);
  };

  const closeAddProductModal = () => {
    setAddProductModalOpen(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <Page title="Product Listing">
      <Card>
        <div className="top-section">
          <div className="filter-section">
            <div className="filter-input" style={{marginLeft:'-40px'}}>
              <TextField
                label="Filter by Product Title"
                value={filterValue}
                onChange={handleFilterChange}
                placeholder="Enter product title"
              />
            </div>
            <div className="add-product-button" style={{position:'relative',top:'11px'}}>
              <Button  primary onClick={openAddProductModal}>Add Product</Button>
            </div>
            <div className="filter-icon" style={{position:'relative',top:'11px'}}>
              <Button plain icon={AdjustIcon} onClick={toggleFilters} />
            </div>
          </div>
          {showFilters && (
            <div className="filter-dropdown" style={{position:'relative',top:'11px'}}>
              <Filters
                filters={[
                  {
                    key: 'priceRange',
                    label: 'Price Range',
                    filter: (
                      <ChoiceList
                        title="Price Range"
                        titleHidden
                        choices={priceFilterOptions}
                        selected={[priceRangeFilter]}
                        onChange={handlePriceRangeChange}
                      />
                    ),
                  },
                  {
                    key: 'category',
                    label: 'Category',
                    filter: (
                      <ChoiceList
                        title="Category"
                        titleHidden
                        choices={categoryFilterOptions}
                        selected={[categoryFilter]}
                        onChange={handleCategoryChange}
                      />
                    ),
                  },
                ]}
                appliedFilters={appliedFilters}
                onClearAll={clearFilters}
                hideQueryField
              />
            </div>
          )}
        </div>
        
        {loading && <Banner status="info">Loading...</Banner>}
        {error && <Banner status="critical">{error}</Banner>}
        {!loading && !error && filteredProducts.length === 0 && (
          <EmptyState
            image={emptyStateImage}
            heading="No products found"
            action={<Button onClick={clearFilters}>Clear Filters</Button>}
          />
        )}
        {!loading && !error && filteredProducts.length > 0 && (
          <DataTable
            columnContentTypes={['numeric','image', 'text', 'text', 'numeric', 'text']}
            headings={[<div className='text2'style={{position:'relative',right:'10px',fontWeight:'800',fontSize:'20px'}}>No.</div>,<div></div>,'', <div style={{position:'relative',left:'170px',fontWeight:'800',fontSize:'20px'}}>Product</div>,<div style={{position:'relative',left:'50px',fontWeight:'800',fontSize:'20px'}}>Price</div>,<div style={{position:'relative',left:'120px',fontWeight:'800',fontSize:'20px'}}>Category</div>]}
            rows={paginatedProducts.map((product, index) => (
              [
                <div className='products-r'>
                <button
                  aria-label={`View ${product.title}`}
                  className="product-row-button"
                  onClick={() => handleRowClick(product.id)}
                >
                {product.id}</button>,
                <button
                  aria-label={`View ${product.title}`}
                  className="product-row-button"
                  onClick={() => handleRowClick(product.id)}
                >
                  <img src={product.image} alt={product.title} style={{ width: '50px', height: '50px' }} />
                </button>,
                <button
                aria-label={`View ${product.title}`}
                className="product-row-button"
                onClick={() => handleRowClick(product.id)}
              >
                {product.title}</button>,
   <button
   aria-label={`View ${product.title}`}
   className="product-row-button"
   onClick={() => handleRowClick(product.id)}
 >${product.price}</button>,
 <button
 aria-label={`View ${product.title}`}
 className="product-row-button"
 onClick={() => handleRowClick(product.id)}
> {product.category}</button></div>
              ]
            ))}
            footerContent={`Total products: ${filteredProducts.length}`}
            className="Polaris-DataTable--wider" // Apply the class here
          />
        )}
        {totalPages > 1 && (
          <div style={{ marginTop: '20px', textAlign: 'center',position:'relative',left:'435px' }}>
            <Pagination
              hasPrevious={currentPage > 1}
              onPrevious={() => handlePageChange(currentPage - 1)}
              hasNext={currentPage < totalPages}
              onNext={() => handlePageChange(currentPage + 1)}
            />
          </div>
        )}
      </Card>
      <ProductModal
        open={modalOpen}
        onClose={closeModal}
        productId={selectedProduct ? selectedProduct.id : null}
        products={products}
      />
      <AddProductModal
        open={addProductModalOpen}
        onClose={closeAddProductModal}
        onAddProduct={handleAddProduct}
        products={products}
      />
    </Page>
  );
}

export default ProductListingPage;

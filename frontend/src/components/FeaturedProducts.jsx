import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { ProductSkeleton } from './LoadingSkeleton';
import api from '../services/api';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Request 20 products from backend
        const { data } = await api.get('/products?pageSize=20');
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (!loading && (!products || products.length === 0)) {
    return null; // Don't show the section if no products
  }

  return (
    <section className="pb-8 lg:pb-16 pt-0 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-20 max-w-7xl relative z-10">


        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-8">
          {loading ? (
            Array(10).fill(0).map((_, index) => <ProductSkeleton key={index} />)
          ) : (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </div>
      </div>
      
      {/* Decorative Accent */}
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
    </section>
  );
};

export default FeaturedProducts;

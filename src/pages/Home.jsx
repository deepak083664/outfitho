import React, { useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import CategoriesSection from '../components/CategoriesSection';
import MainCategorySelector from '../components/MainCategorySelector';
import FeaturedProducts from '../components/FeaturedProducts';

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen pt-0 bg-white">
      <HeroSection />
      <CategoriesSection />
      <MainCategorySelector />
      <FeaturedProducts />
    </div>
  );
};

export default Home;

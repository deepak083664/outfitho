import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const categories = [
  { name: 'Men', path: 'Men' },
  { name: 'Women', path: 'Women' },
  { name: 'Kids', path: 'Kids' },
  { name: 'Accessories', path: 'Accessories' },
];

const MainCategorySelector = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');

  const handleCategoryClick = (category) => {
    navigate(`/shop?category=${category}`);
  };

  return (
    <div className="bg-white pt-1 lg:pt-2 pb-0 border-b border-surface/30">
      <div className="container mx-auto px-4 lg:px-20 max-w-7xl">
        <div className="flex items-center justify-center space-x-2 lg:space-x-5 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategoryClick(cat.path)}
              className={`
                px-5 lg:px-10 py-1.5 lg:py-2
                text-[8px] lg:text-[10px] font-black uppercase tracking-[0.2em]
                rounded-full transition-all duration-500 active:scale-95
                ${activeCategory === cat.path 
                  ? 'bg-dark text-white shadow-lg translate-y-[-1px]' 
                  : 'bg-surface text-secondary hover:bg-white hover:text-dark hover:shadow-md border border-transparent hover:border-border'
                }
              `}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainCategorySelector;

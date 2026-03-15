import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(keyword.trim())}`);
    }
  };

  return (
    <div className="w-full bg-white py-0.5">
      <div className="container mx-auto px-4 lg:px-20">
        <form 
          onSubmit={handleSubmit}
          className="relative max-w-2xl mx-auto group"
        >
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-light group-focus-within:text-dark transition-colors">
            <Search size={16} strokeWidth={3} />
          </div>
          <input
            type="text"
            placeholder="search products"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full bg-surface border border-transparent focus:bg-white focus:border-dark px-12 py-1.5 rounded-full text-xs font-normal tracking-wide placeholder:text-gray-400 placeholder:italic focus:outline-none transition-all duration-300 shadow-sm focus:shadow-xl"
          />
          {keyword && (
            <button
              type="button"
              onClick={() => setKeyword('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-light hover:text-dark transition-colors"
            >
              <X size={16} strokeWidth={3} />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default SearchBar;

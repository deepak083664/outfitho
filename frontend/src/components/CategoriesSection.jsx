import React from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
  { name: 'T-Shirts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800' },
  { name: 'Shirts', image: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&q=80&w=800' },
  { name: 'Jeans', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=500' },
  { name: 'Jackets', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=500' },
  { name: 'Hoodies', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=500' },
  { name: 'Dresses', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800' },
  { name: 'Accessories', image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800' },
];

import { useRef, useEffect } from 'react';

const CategoriesSection = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId;
    let scrollPos = 0;
    const scrollSpeed = 0.5; // Pixels per frame

    const scroll = () => {
      scrollPos += scrollSpeed;
      if (scrollPos >= scrollContainer.scrollWidth / 2) {
        scrollPos = 0;
      }
      scrollContainer.scrollLeft = scrollPos;
      animationId = requestAnimationFrame(scroll);
    };

    // Only auto-scroll if content overflows or for a marquee effect
    // To make it seamless, we double the items
    animationId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationId);
  }, []);

  // Double the categories for seamless looping
  const displayCategories = [...categories, ...categories];

  return (
    <section className="pt-2 lg:pt-4 pb-0 bg-white overflow-hidden">
      <div className="container mx-auto px-4 lg:px-10">
        <div className="flex flex-col items-center mb-1 text-center">
          <span className="text-[10px] font-black uppercase text-primary tracking-[0.4em]">Explore Collections</span>
        </div>

        {/* Categories Auto-Slider */}
        <div
          ref={scrollRef}
          className="flex overflow-x-hidden space-x-4 lg:space-x-8 pb-0 no-scrollbar cursor-grab active:cursor-grabbing"
          onMouseEnter={() => { }} // Could pause on hover if desired
        >
          {displayCategories.map((cat, index) => (
            <div
              key={`${cat.name}-${index}`}
              className="flex-shrink-0 flex flex-col items-center group cursor-pointer"
              onClick={() => navigate(`/shop?category=${cat.name}`)}
            >
              <div className="w-20 h-20 lg:w-36 lg:h-36 rounded-full overflow-hidden border-4 border-surface group-hover:border-primary shadow-xl transition-all duration-500 group-hover:scale-105 relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
              </div>
              <span className="mt-2 text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] text-dark group-hover:text-primary transition-colors">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;

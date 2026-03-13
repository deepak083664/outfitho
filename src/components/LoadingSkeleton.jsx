import React from 'react';

export const ProductSkeleton = () => {
  return (
    <div className="flex flex-col relative overflow-hidden">
      <div className="aspect-square bg-surface rounded-2xl mb-4 w-full relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
      </div>
      <div className="h-2 bg-surface rounded-full w-1/4 mb-3 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
      </div>
      <div className="h-4 bg-surface rounded-full w-3/4 mb-4 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
      </div>
      <div className="flex justify-between items-center">
        <div className="h-3 bg-surface rounded-full w-1/4 relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
        </div>
      </div>
    </div>
  );
};

export const CategorySkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="aspect-square md:aspect-auto md:min-h-[400px] bg-gray-200 rounded-lg w-full"></div>
    </div>
  );
};

export const ProductDetailSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-24 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-[4/5] bg-gray-200 rounded-lg"></div>
        <div className="flex flex-col justify-center">
          <div className="h-4 bg-gray-200 rounded w-1/6 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-px bg-gray-200 mb-8 w-full"></div>
          <div className="h-6 bg-gray-200 rounded w-2/4 mb-4"></div>
          <div className="h-24 bg-gray-200 rounded w-full mb-8"></div>
          <div className="h-12 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
};

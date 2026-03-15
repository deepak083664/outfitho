import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, X, ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]); // Store { file: File, preview: string }
  
  const [formData, setFormData] = useState({
    name: '',
    categories: [],
    price: '',
    stock: '',
    description: '',
    materialCare: '',
    shippingReturns: '',
    sizes: [], // will store { size: string, price: number }
    brand: 'OUTFITHO',
    discount: 0,
    rating: 0
  });

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleSizeSelection = (size) => {
    setFormData(prev => {
      const exists = prev.sizes.find(s => s.size === size);
      if (exists) {
        return { ...prev, sizes: prev.sizes.filter(s => s.size !== size) };
      } else {
        return { ...prev, sizes: [...prev.sizes, { size, price: prev.price || 0 }] };
      }
    });
  };

  const updateSizePrice = (size, price) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.map(s => s.size === size ? { ...s, price: Number(price) } : s)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('categories', JSON.stringify(formData.categories));
    data.append('brand', formData.brand);
    data.append('countInStock', formData.stock);
    data.append('description', formData.description);
    data.append('materialCare', formData.materialCare);
    data.append('shippingReturns', formData.shippingReturns);
    data.append('sizes', JSON.stringify(formData.sizes));
    data.append('discount', formData.discount);
    data.append('rating', formData.rating);

    images.forEach((img) => {
      data.append('images', img.file);
    });

    try {
      setLoading(true);
      await api.post('/products', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Product successfully published');
      navigate('/admin/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 px-2">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/admin/products')}
            className="p-2.5 border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors bg-white shadow-sm"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-heading text-gray-900">Add Product</h1>
            <p className="text-gray-500 text-xs md:text-sm mt-0.5 tracking-wide">Create a new item in your inventory</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 px-2 md:px-0">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* General Info */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">General Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-shadow"
                  placeholder="e.g. Slim Fit Denim Jacket"
                />
              </div>
              <div className="pt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Manual Rating (0-5)</label>
                <input 
                  type="number" 
                  name="rating"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-shadow"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea 
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-black focus:border-black resize-none transition-shadow"
                  placeholder="Describe your product..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Material & Care</label>
                <textarea 
                  name="materialCare"
                  rows={3}
                  value={formData.materialCare}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-black focus:border-black resize-none transition-shadow"
                  placeholder="e.g. 100% Cotton, Machine Wash Cold..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Shipping & Returns</label>
                <textarea 
                  name="shippingReturns"
                  rows={3}
                  value={formData.shippingReturns}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-black focus:border-black resize-none transition-shadow"
                  placeholder="e.g. Free shipping on orders over ₹999..."
                />
              </div>
            </div>
          </div>

          {/* Media Section */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-semibold text-gray-900">Media</h3>
               <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">{images.length}/5 Images</span>
            </div>
            
            <div className={`border-2 border-dashed rounded-xl p-8 transition-colors text-center cursor-pointer hover:bg-gray-50 relative ${images.length > 0 ? 'border-gray-200' : 'border-gray-300'}`}>
               <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
               />
               <UploadCloud className="mx-auto h-10 w-10 text-gray-400 mb-3" />
               <p className="text-sm font-medium text-gray-900">Drag and drop your images here</p>
               <p className="text-xs text-gray-500 mt-1">or click to browse from your computer (JPG, PNG)</p>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-6">
                {images.map((img, index) => (
                  <div key={index} className="relative aspect-square border border-gray-100 rounded-xl overflow-hidden group shadow-sm bg-gray-50">
                    <img src={img.preview} alt={`Preview ${index}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <button 
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1.5 right-1.5 bg-white shadow-md text-red-500 hover:text-red-700 rounded-full p-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-20"
                    >
                      <X size={14} strokeWidth={3} />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[10px] uppercase font-bold text-center py-1">Cover</div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {images.length === 0 && (
              <div className="mt-6 flex flex-col items-center justify-center h-32 bg-gray-50 rounded-lg border border-gray-100 italic text-gray-400 text-sm">
                <ImageIcon size={24} className="mb-2 opacity-50" />
                No images uploaded yet.
              </div>
            )}
          </div>

        </div>

        {/* Right Column - Organization & Variants */}
        <div className="space-y-8">
          
          {/* Pricing & Inventory */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Pricing & Inventory</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Regualr Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <input 
                    type="number" 
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-shadow"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="pt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock Quantity</label>
                <input 
                  type="number" 
                  name="stock"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-shadow"
                  placeholder="0"
                />
              </div>
              <div className="pt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount Percentage (%)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    name="discount"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-shadow"
                    placeholder="0"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Organization */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Organization</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2.5">Categories</label>
                <div className="flex flex-wrap gap-2">
                  {['Men', 'Women', 'Kids', 'T-Shirts', 'Shirts', 'Jeans', 'Jackets', 'Hoodies', 'Dresses', 'Accessories'].map(cat => {
                    const isSelected = formData.categories.includes(cat);
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            categories: isSelected 
                              ? prev.categories.filter(c => c !== cat)
                              : [...prev.categories, cat]
                          }));
                        }}
                        className={`px-4 py-2 rounded-full border text-xs font-bold transition-all ${
                          isSelected 
                            ? 'border-black bg-black text-white shadow-sm' 
                            : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Brand / Vendor</label>
                <input 
                  type="text" 
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-shadow"
                />
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Variants</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2.5">Available Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map(size => {
                    const isSelected = formData.sizes.find(s => s.size === size);
                    return (
                      <button
                        type="button"
                        key={size}
                        onClick={() => toggleSizeSelection(size)}
                        className={`min-w-[40px] h-10 px-3 rounded border text-sm font-semibold transition-all ${
                          isSelected 
                            ? 'border-black bg-black text-white shadow-sm' 
                            : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>

                {/* Individual Size Price Inputs */}
                {formData.sizes.length > 0 && (
                  <div className="mt-8 space-y-4 pt-6 border-t border-gray-100">
                    <h4 className="text-sm font-bold text-gray-900 mb-4">Set Prices per Size</h4>
                    <div className="grid grid-cols-1 gap-4">
                      {formData.sizes.map((s, idx) => (
                        <div key={idx} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <span className="w-12 font-black text-sm text-gray-700">{s.size}</span>
                          <div className="relative flex-1">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">₹</span>
                            <input 
                              type="number"
                              value={s.price}
                              onChange={(e) => updateSizePrice(s.size, e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 z-40">
        <div className="max-w-5xl mx-auto flex items-center space-x-4">
          <button 
            type="button"
            onClick={() => navigate('/admin/products')}
            className="flex-1 px-6 py-3 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm active:scale-95"
          >
            Discard
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="flex-[2] px-8 py-3 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : 'Publish Product'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import api from '../services/api';

const defaultSlides = [
  {
    id: 1,
    title: "UNLEASH <br /> YOUR <br /> STYLE",
    subtitle: "Premium Collection 2026",
    desc: "Curated fashion pieces designed for those who dare to be different.",
    mobileImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1000",
    desktopImage: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2000",
    overlay: "bg-black/10",
    accent: "text-primary"
  },
  {
    id: 2,
    title: "SUMMER <br /> VIBE <br /> ESSENTIALS",
    subtitle: "New Season Arrivals",
    desc: "Experience the ultimate comfort with our lightweight linen collection.",
    mobileImage: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=1000",
    desktopImage: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=2000",
    overlay: "bg-blue-900/10",
    accent: "text-blue-600"
  },
  {
    id: 3,
    title: "URBAN <br /> NIGHTS <br /> EDIT",
    subtitle: "Luxury Streetwear",
    desc: "Statement pieces for the concrete jungle. Bold, dark, and unapologetic.",
    mobileImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000",
    desktopImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000",
    overlay: "bg-purple-900/20",
    accent: "text-purple-500"
  }
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState(defaultSlides);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await api.get('/banners');
        if (res.data && res.data.length > 0) {
          const mappedBanners = res.data.map(banner => ({
            id: banner._id,
            title: banner.title || '',
            subtitle: banner.subtitle || '',
            desc: banner.desc || '',
            mobileImage: banner.image,
            desktopImage: banner.image, // Using the same image for both
            overlay: "bg-black/10",
            accent: "text-primary"
          }));
          setSlides(mappedBanners);
        }
      } catch (error) {
        console.error("Failed to fetch banners", error);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative w-full h-[40vh] lg:h-[70vh] overflow-hidden bg-surface group/hero">
      {slides.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-all duration-[2000ms] cubic-bezier(0.23, 1, 0.32, 1) ${
            index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'
          }`}
        >
          {/* Images with darker overlay for premium feel */}
          <picture>
             <source media="(min-width: 1024px)" srcSet={slide.desktopImage} />
             <img 
               src={slide.mobileImage} 
               alt={slide.subtitle} 
               className="w-full h-full object-cover"
             />
          </picture>

          {/* Elegant Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-10 transition-all duration-1000"></div>

          {/* Content Area */}
          <div className="absolute inset-0 flex flex-col justify-center pt-10 lg:pt-20 px-6 lg:px-32 z-20">
             <div className={`max-w-4xl transition-all duration-1000 delay-500 ${
                index === current ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
             }`}>
                {slide.subtitle && (
                  <span className="inline-block text-white font-black tracking-[0.3em] text-[10px] lg:text-xs uppercase mb-3 lg:mb-5 drop-shadow-lg opacity-90 border-l-2 border-white pl-3">
                    {slide.subtitle}
                  </span>
                )}
                
                <h1 
                  className="text-white text-4xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-4 lg:mb-6 drop-shadow-2xl"
                  dangerouslySetInnerHTML={{ __html: slide.title }}
                ></h1>
                
                {slide.desc && (
                  <p className="text-white/80 text-xs lg:text-base font-medium max-w-xs lg:max-w-xl mb-8 lg:mb-10 leading-relaxed drop-shadow-lg">
                    {slide.desc}
                  </p>
                )}
                
                <button 
                  onClick={() => navigate('/shop')}
                  className="group/btn relative inline-flex items-center justify-center px-6 py-3 lg:px-14 lg:py-5 overflow-hidden font-black tracking-[0.2em] text-[10px] lg:text-xs text-white uppercase transition-all duration-500 bg-transparent border-2 border-white rounded-full hover:bg-white hover:text-dark active:scale-95 shadow-2xl"
                >
                  <span className="relative z-10">EXPLORE COLLECTION</span>
                  <ArrowRight size={18} className="ml-3 transition-transform group-hover/btn:translate-x-2 relative z-10" />
                </button>
             </div>
          </div>
        </div>
      ))}

      {/* Navigation Controls - Desktop Only */}
      <div className="hidden lg:flex absolute bottom-6 right-24 space-x-6 z-30">
         <button 
           onClick={prevSlide}
           className="p-4 bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl text-dark hover:bg-white transition-all active:scale-90"
         >
            <ChevronLeft size={24} />
         </button>
         <button 
           onClick={nextSlide}
           className="p-4 bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl text-dark hover:bg-white transition-all active:scale-90"
         >
            <ChevronRight size={24} />
         </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-3 z-30">
         {slides.map((_, i) => (
            <button 
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1 transition-all duration-500 rounded-full ${
                i === current ? 'w-12 bg-dark shadow-xl' : 'w-4 bg-dark/20 hover:bg-dark/40'
              }`}
            ></button>
         ))}
      </div>
    </section>
  );
};

export default HeroSection;

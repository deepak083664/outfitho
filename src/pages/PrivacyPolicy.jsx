import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-white min-h-screen py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-dark mb-4 text-center">
          Privacy <span className="text-secondary opacity-50">Policy</span>
        </h1>
        <div className="w-20 h-1.5 bg-primary mx-auto mb-12"></div>
        
        <div className="bg-gray-50 rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-200">
            <span className="text-xs font-black uppercase tracking-widest text-secondary">Data Protection Document</span>
            <span className="text-xs font-bold text-gray-500">Last Updated: March 2026</span>
          </div>

          <div className="prose prose-lg max-w-none text-secondary space-y-10">
            <section>
              <p className="text-lg leading-relaxed">
                <strong>Outfitho</strong> respects your privacy and is committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black uppercase tracking-wider text-dark mb-4 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-dark text-white flex items-center justify-center text-xs mr-3">01</span>
                Information We Collect
              </h2>
              <p className="mb-4">We may collect the following information to provide a better shopping experience:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Name', 'Phone Number', 'Email Address', 'Shipping Address', 'Payment Information'].map((item, idx) => (
                  <div key={idx} className="flex items-center p-4 bg-white rounded-xl border border-gray-100 italic font-bold text-dark">
                    <span className="w-2 h-2 rounded-full bg-primary mr-3"></span>
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-black uppercase tracking-wider text-dark mb-4 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-dark text-white flex items-center justify-center text-xs mr-3">02</span>
                How We Use Your Information
              </h2>
              <p className="mb-4">Your information is used to:</p>
              <ul className="space-y-3 list-none pl-0">
                {['Process and fulfill orders', 'Deliver products to your address', 'Communicate regarding your account/orders', 'Improve our website and services'].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-primary mr-2 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black uppercase tracking-wider text-dark mb-4 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-dark text-white flex items-center justify-center text-xs mr-3">03</span>
                Data Protection
              </h2>
              <p>We take appropriate security measures and use industry-standard protocols to protect your personal data from unauthorized access, alteration, or disclosure.</p>
            </section>

            <section>
              <h2 className="text-xl font-black uppercase tracking-wider text-dark mb-4 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-dark text-white flex items-center justify-center text-xs mr-3">04</span>
                Sharing Information
              </h2>
              <p className="mb-4">We do <strong>not</strong> sell or rent customer data to third parties. Information may only be shared with:</p>
              <ul className="space-y-3 list-none pl-0 italic font-medium">
                <li className="flex items-center text-dark">
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full mr-3"></span>
                  Delivery partners (for shipping)
                </li>
                <li className="flex items-center text-dark">
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full mr-3"></span>
                  Payment gateways (for transaction processing)
                </li>
                <li className="flex items-center text-dark">
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full mr-3"></span>
                  Legal authorities (strictly if required by law)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black uppercase tracking-wider text-dark mb-4 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-dark text-white flex items-center justify-center text-xs mr-3">05</span>
                Cookies
              </h2>
              <p>Our website may use cookies to improve user experience, remember your preferences, and track website functionality and performance.</p>
            </section>

            <section className="pt-10 border-t border-gray-200">
              <h2 className="text-xl font-black uppercase tracking-wider text-dark mb-6">Contact Us</h2>
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <p className="mb-6 font-medium text-secondary">If you have any questions about our privacy policy, please reach out to us:</p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mr-4">
                       <span className="font-bold">P</span>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black text-gray-400">Phone</p>
                      <p className="font-bold text-dark">+91 6209970552</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mr-4">
                       <span className="font-bold">E</span>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black text-gray-400">Email</p>
                      <p className="font-bold text-dark">Outfitoo@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm italic">© {new Date().getFullYear()} OUTFITHO - Your Privacy Matters</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

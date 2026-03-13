import React from 'react';

const Terms = () => {
  return (
    <div className="bg-white min-h-screen py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-dark mb-4 text-center">
          Terms & <span className="text-secondary opacity-50">Conditions</span>
        </h1>
        <div className="w-20 h-1.5 bg-primary mx-auto mb-12"></div>
        
        <div className="bg-gray-50 rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-200">
            <span className="text-xs font-black uppercase tracking-widest text-secondary">Policy Document</span>
            <span className="text-xs font-bold text-gray-500">Last Updated: March 2026</span>
          </div>

          <div className="prose prose-lg max-w-none text-secondary space-y-10">
            <section>
              <p className="text-lg leading-relaxed">
                Welcome to <strong>Outfitho.com</strong>. These Terms & Conditions govern your use of our website and services. By accessing or purchasing from our website, you agree to these terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black uppercase tracking-wider text-dark mb-4 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-dark text-white flex items-center justify-center text-xs mr-3">01</span>
                General Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl border border-gray-100 italic">
                <div>
                  <p className="text-xs uppercase font-bold text-gray-400 mb-1">Business Name</p>
                  <p className="font-bold text-dark">Outfitho</p>
                </div>
                <div>
                  <p className="text-xs uppercase font-bold text-gray-400 mb-1">Owner</p>
                  <p className="font-bold text-dark">Anish Bhadwa</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs uppercase font-bold text-gray-400 mb-1">Location</p>
                  <p className="font-bold text-dark">Pardih, Barki Pona, Ramgarh, Jharkhand, India</p>
                </div>
                <div>
                  <p className="text-xs uppercase font-bold text-gray-400 mb-1">Phone</p>
                  <p className="font-bold text-dark">+91 6209970552</p>
                </div>
                <div>
                  <p className="text-xs uppercase font-bold text-gray-400 mb-1">Email</p>
                  <p className="font-bold text-dark">Outfitoo@gmail.com</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-black uppercase tracking-wider text-dark mb-4 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-dark text-white flex items-center justify-center text-xs mr-3">02</span>
                Use of Website
              </h2>
              <p className="mb-4">By using this website, you agree that:</p>
              <ul className="space-y-3 list-none pl-0">
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">•</span>
                  <span>You are at least 18 years old or using the website under parental guidance.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">•</span>
                  <span>You will not misuse the website or attempt unauthorized access.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">•</span>
                  <span>All information provided by you during purchase is accurate.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black uppercase tracking-wider text-dark mb-4 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-dark text-white flex items-center justify-center text-xs mr-3">03</span>
                Product Information
              </h2>
              <p className="mb-4">We try our best to ensure that all product descriptions, images, and prices are accurate. However:</p>
              <ul className="space-y-3 list-none pl-0">
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">•</span>
                  <span>Slight color differences may occur due to screen settings.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">•</span>
                  <span>Prices and availability may change without prior notice.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black uppercase tracking-wider text-dark mb-4 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-dark text-white flex items-center justify-center text-xs mr-3">04</span>
                Orders
              </h2>
              <ul className="space-y-3 list-none pl-0">
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">•</span>
                  <span>Once an order is placed, you will receive an order confirmation.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">•</span>
                  <span>Outfitho reserves the right to cancel orders due to stock issues or suspicious activity.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black uppercase tracking-wider text-dark mb-4 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-dark text-white flex items-center justify-center text-xs mr-3">05</span>
                Payment
              </h2>
              <p>We accept online payments and other payment methods available on the website.</p>
            </section>

            <section>
              <h2 className="text-xl font-black uppercase tracking-wider text-dark mb-4 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-dark text-white flex items-center justify-center text-xs mr-3">06</span>
                Intellectual Property
              </h2>
              <p className="mb-4">All content on this website including logo, images, product designs, and website content belongs to <strong>Outfitho</strong> and cannot be used without permission.</p>
            </section>

            <section>
              <h2 className="text-xl font-black uppercase tracking-wider text-dark mb-4 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-dark text-white flex items-center justify-center text-xs mr-3">07</span>
                Limitation of Liability
              </h2>
              <p className="mb-4">Outfitho will not be responsible for:</p>
              <ul className="space-y-3 list-none pl-0">
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">•</span>
                  <span>Delays caused by courier partners.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">•</span>
                  <span>Incorrect address provided by customers.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">•</span>
                  <span>Natural events affecting delivery (Force Majeure).</span>
                </li>
              </ul>
            </section>

            <section className="pt-10 border-t border-gray-200">
              <h2 className="text-xl font-black uppercase tracking-wider text-dark mb-4">Changes to Terms</h2>
              <p>Outfitho reserves the right to update these terms at any time without prior notice. Continued use of the website constitutes acceptance of the new terms.</p>
            </section>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm italic">© {new Date().getFullYear()} OUTFITHO - All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
};

export default Terms;

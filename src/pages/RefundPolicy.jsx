import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="bg-white min-h-screen py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-dark mb-4 text-center">
          Refund & <span className="text-secondary opacity-50">Return Policy</span>
        </h1>
        <div className="w-20 h-1.5 bg-primary mx-auto mb-12"></div>
        
        <div className="bg-gray-50 rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-200">
            <span className="text-xs font-black uppercase tracking-widest text-secondary">Service Promise</span>
            <span className="text-xs font-bold text-gray-500">Last Updated: March 2026</span>
          </div>

          <div className="prose prose-lg max-w-none text-secondary space-y-10">
            <section>
              <p className="text-lg leading-relaxed">
                At <strong>Outfitho</strong>, customer satisfaction is important to us. We understand that sometimes things don't go as planned, and we are here to help with your returns and refunds.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black uppercase tracking-wider text-dark mb-4 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-dark text-white flex items-center justify-center text-xs mr-3">01</span>
                Return Policy
              </h2>
              <p className="mb-4">You can request a return if:</p>
              <ul className="space-y-3 list-none pl-0">
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">•</span>
                  <span>The product is damaged upon arrival.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">•</span>
                  <span>The wrong item was delivered.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">•</span>
                  <span>There is a manufacturing defect.</span>
                </li>
              </ul>
              <p className="mt-4 font-bold text-dark italic">Important: Return request must be made within 3 days of delivery.</p>
            </section>

            <section>
              <h2 className="text-xl font-black uppercase tracking-wider text-dark mb-4 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-dark text-white flex items-center justify-center text-xs mr-3">02</span>
                Return Conditions
              </h2>
              <p className="mb-4">To be eligible for a return, ensure the following:</p>
              <ul className="space-y-3 list-none pl-0">
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">•</span>
                  <span>Item must be unused and in the same condition as received.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">•</span>
                  <span>Item must be in its original packaging.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">•</span>
                  <span>Product tags must be intact and attached.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black uppercase tracking-wider text-dark mb-4 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-dark text-white flex items-center justify-center text-xs mr-3">03</span>
                Non-Returnable Items
              </h2>
              <p className="mb-4">We do <strong>not</strong> accept returns for:</p>
              <ul className="space-y-3 list-none pl-0">
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">•</span>
                  <span>Used or laundered clothing.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">•</span>
                  <span>Items damaged due to customer misuse or poor handling.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black uppercase tracking-wider text-dark mb-4 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-dark text-white flex items-center justify-center text-xs mr-3">04</span>
                Refund Process
              </h2>
              <p className="mb-4">Once we receive and inspect the returned product:</p>
              <ul className="space-y-3 list-none pl-0">
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">•</span>
                  <span>Refund will be processed within 5-7 business days.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">•</span>
                  <span>Refund will be sent to the original payment method used during purchase.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black uppercase tracking-wider text-dark mb-4 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-dark text-white flex items-center justify-center text-xs mr-3">05</span>
                Exchange & Shipping
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-dark mb-2">Exchange</h3>
                  <p>If the size is incorrect, customers can request an exchange (subject to stock availability).</p>
                </div>
                <div>
                  <h3 className="font-bold text-dark mb-2">Shipping Charges</h3>
                  <p>Shipping charges are <strong>non-refundable</strong> unless the product delivered was wrong or damaged.</p>
                </div>
              </div>
            </section>

            <section className="pt-10 border-t border-gray-200">
               <h2 className="text-xl font-black uppercase tracking-wider text-dark mb-6">Late or Missing Refunds</h2>
               <p className="mb-4">If you have not received your refund yet:</p>
               <ul className="space-y-3 list-none pl-0 mb-6">
                 <li className="flex items-start">
                   <span className="text-primary mr-2 font-bold">1.</span>
                   <span>First check your bank account again.</span>
                 </li>
                 <li className="flex items-start">
                   <span className="text-primary mr-2 font-bold">2.</span>
                   <span>Contact your bank or payment provider (there is often some processing time).</span>
                 </li>
                 <li className="flex items-start">
                   <span className="text-primary mr-2 font-bold">3.</span>
                   <span>If the issue continues, please contact us immediately.</span>
                 </li>
               </ul>

               <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <p className="font-bold text-dark flex items-center">
                    <span className="mr-3">📞</span> +91 6209970552
                  </p>
                  <p className="font-bold text-dark flex items-center">
                    <span className="mr-3">📧</span> Outfitoo@gmail.com
                  </p>
                  <div className="pt-4 mt-4 border-t border-gray-50">
                    <p className="text-xs uppercase font-black text-gray-400 mb-2">Operations Address</p>
                    <p className="text-sm font-bold text-dark leading-relaxed">
                      Outfitho<br />
                      Pardih, Barki Pona<br />
                      Ramgarh, Jharkhand, India
                    </p>
                  </div>
               </div>
            </section>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm italic">© {new Date().getFullYear()} OUTFITHO - Easy Returns, Happy Shopping</p>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;

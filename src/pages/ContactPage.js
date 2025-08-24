import React from 'react';
import { Phone, Mail, ShieldCheck } from 'lucide-react';

const ContactPage = () => {
  const name = 'Mohan Prasath S';
  const phone = '9025421149';
  const email = 'mohanprasath563@gmail.com';

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
        <h1 className="text-3xl font-extrabold text-secondary-900 mb-2">Contact</h1>
        <p className="text-secondary-700 mb-8">Reach out to the main creator of MediSmart-AI.</p>

        <div className="flex items-start gap-4 p-5 rounded-lg border border-secondary-200 bg-secondary-50">
          <div className="h-12 w-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg">MP</div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-secondary-900">{name}</h2>
              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-100 text-xs font-semibold px-2 py-0.5 rounded-full">
                <ShieldCheck size={14} /> Main Creator
              </span>
            </div>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-secondary-500" />
                <a href={`tel:${phone}`} className="text-secondary-800 hover:text-primary-700">{phone}</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-secondary-500" />
                <a href={`mailto:${email}`} className="text-secondary-800 hover:text-primary-700">{email}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

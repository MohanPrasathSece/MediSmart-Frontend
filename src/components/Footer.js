import React from 'react';
import { Link } from 'react-router-dom';
import { Pill } from 'lucide-react';

const Footer = () => {
  const footerLinks = [
    { to: '/about', text: 'About Us' },
    { to: '/contact', text: 'Contact' },
  ];

  return (
    <footer className="bg-gradient-to-b from-white to-secondary-50 border-t border-secondary-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top row: brand | links | CTA */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Brand */}
          <div className="space-y-2">
            <Link to="/" className="inline-flex items-center gap-2 text-2xl font-extrabold text-primary-700">
              <Pill size={24} />
              <span>MediSmart-AI</span>
            </Link>
            <p className="text-secondary-600 text-sm max-w-xl">
              Your AI-powered health companion for comparing prices, managing prescriptions, and doorstep delivery.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 text-[11px] font-semibold border border-primary-100">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-600" />
              Fast. Reliable. Secure.
            </div>
          </div>

          {/* Links */}
          <nav className="flex items-start md:items-center gap-6">
            <div>
              <h3 className="text-xs font-semibold text-secondary-900 tracking-wide mb-2">Company</h3>
              <ul className="space-y-2 md:space-y-0 md:flex md:items-center md:gap-4">
                {footerLinks.map(link => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-secondary-600 hover:text-primary-600 text-sm">
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* CTA */}
          <div className="shrink-0">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg bg-primary-600 text-white hover:bg-primary-700 shadow-sm"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 border-t border-secondary-200" />

        {/* Bottom row */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-secondary-500">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-1 rounded-full bg-secondary-100 text-secondary-700">Healthcare</span>
            <span className="px-2 py-1 rounded-full bg-secondary-100 text-secondary-700">AI</span>
            <span className="px-2 py-1 rounded-full bg-secondary-100 text-secondary-700">Delivery</span>
          </div>
          <p className="text-center md:text-right">© {new Date().getFullYear()} MediSmart-AI</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

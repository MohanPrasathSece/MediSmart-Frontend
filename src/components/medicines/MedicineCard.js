import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pill } from 'lucide-react';

const MedicineCard = ({ medicine, variant }) => {
  const isAvailable = medicine.stock > 0 && typeof medicine.price !== 'undefined';
  const navigate = useNavigate();
  const isCompact = variant === 'compact';

  const API_BASE = process.env.REACT_APP_API_URL || '/api';
  const derived = API_BASE.replace(/\/api\/?$/, '');
  const SERVER_BASE = derived || (typeof window !== 'undefined' ? window.location.origin : '');
  const resolveImageUrl = (p) => {
    if (!p || typeof p !== 'string') return null;
    if (/^https?:\/\//i.test(p)) return p;
    if (p.startsWith('/')) return `${SERVER_BASE}${p}`;
    return `${SERVER_BASE}/${p}`; // e.g., 'uploads/abc.jpg'
  };

  const src = useMemo(() => {
    const primaryFromImages = Array.isArray(medicine.images) && medicine.images.length > 0 ? medicine.images[0]?.url : null;
    const a = resolveImageUrl(primaryFromImages);
    if (a) return a;
    const b = resolveImageUrl(medicine.imageUrl);
    return b || null;
  }, [medicine.images, medicine.imageUrl]);

  // No external fallbacks; show initials block if src missing

  return (
    <div className={`block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden ${isCompact ? '' : 'group'}`}>
      {!isCompact && (
        <div className="relative">
          {src ? (
            <img
              src={src}
              alt={medicine.name}
              className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-40 bg-secondary-100 flex items-center justify-center">
              <span className="text-secondary-500 font-semibold">
                {(medicine.name || 'Medicine').slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
          <div className="absolute top-2 right-2 bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {medicine.category || 'General'}
          </div>
        </div>
      )}
      <div className="p-4">
        <h3 className={`truncate ${isCompact ? 'text-base font-semibold text-secondary-900' : 'text-lg font-semibold text-secondary-800'}`} title={medicine.name}>
          {medicine.name}
        </h3>
        <p className={`text-secondary-500 ${isCompact ? 'text-xs mb-1' : 'text-sm mb-2'}`}>by {medicine.brand || 'Unknown Brand'}</p>

        <div className={`${isCompact ? 'text-xs mb-3' : 'flex items-center text-sm mb-4'} text-secondary-600`}>
          {isCompact ? (
            <span>{medicine.dosage?.form} - {medicine.dosage?.strength}</span>
          ) : (
            <>
              <Pill size={14} className="mr-1" />
              <span>{medicine.dosage?.form} - {medicine.dosage?.strength}</span>
            </>
          )}
        </div>

        <div className="flex justify-between items-center">
          {isAvailable ? (
            <p className={`${isCompact ? 'text-base' : 'text-xl'} font-bold text-primary-600`}>
              ₹{medicine.price.toFixed(2)}
            </p>
          ) : (
            <p className="text-sm text-secondary-500">Not available</p>
          )}
          <button
            type="button"
            onClick={() => navigate(`/order/now/${medicine._id}`)}
            className={`${isCompact ? 'text-xs px-3 py-1.5' : 'text-xs px-3 py-1'} text-white bg-primary-600 hover:bg-primary-700 font-semibold rounded-full`}
          >
            Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicineCard;

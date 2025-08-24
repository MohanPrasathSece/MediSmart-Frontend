import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useAuth } from '../context/AuthProvider';
import Spinner from '../components/common/Spinner';
import { Pill, Building, Tag, MapPin, IndianRupee, Package } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const fetchMedicineById = async (api, id) => {
  const { data } = await api.get(`/medicines/${id}`);
  return data;
};

const MedicineDetailPage = () => {
  const { id } = useParams();
  const { api } = useAuth();

  const { data: medicine, isLoading, isError, error } = useQuery(
    ['medicine', id],
    () => fetchMedicineById(api, id)
  );

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Spinner size="lg" /></div>;
  }

  if (isError) {
    return <div className="text-center text-red-500 py-10">Error: {error.message}</div>;
  }

  const pharmacy = medicine.pharmacy;
  const hasLocation = pharmacy?.location?.coordinates?.length === 2;
  const mapCenter = hasLocation
    ? [pharmacy.location.coordinates[1], pharmacy.location.coordinates[0]]
    : [51.505, -0.09]; // Default location if no coordinates

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column: Image and Details */}
        <div className="lg:col-span-2">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              {(() => {
                const API_BASE = process.env.REACT_APP_API_URL || '/api';
                const derived = API_BASE.replace(/\/api\/?$/, '');
                const SERVER_BASE = derived || (typeof window !== 'undefined' ? window.location.origin : '');
                const resolveImageUrl = (p) => {
                  if (!p || typeof p !== 'string') return null;
                  if (/^https?:\/\//i.test(p)) return p;
                  if (p.startsWith('/')) return `${SERVER_BASE}${p}`;
                  return `${SERVER_BASE}/${p}`;
                };
                const primaryFromImages = Array.isArray(medicine.images) && medicine.images.length > 0 ? medicine.images[0]?.url : null;
                const src = resolveImageUrl(primaryFromImages) || resolveImageUrl(medicine.imageUrl);
                if (src) {
                  return (
                    <img
                      src={src}
                      alt={medicine.name}
                      className="w-full md:w-1/3 h-48 md:h-56 lg:h-64 object-cover rounded-lg"
                    />
                  );
                }
                const initials = (medicine.name || 'Medicine').slice(0,2).toUpperCase();
                return (
                  <div className="w-full md:w-1/3 h-40 md:h-48 bg-secondary-100 rounded-lg flex items-center justify-center">
                    <span className="text-secondary-500 font-semibold text-xl">{initials}</span>
                  </div>
                );
              })()}
              <div className="flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold text-secondary-900">{medicine.name}</h1>
                <p className="text-secondary-600 mt-1 text-sm lg:text-base">by {medicine.brand || 'N/A'}</p>
                <div className="flex flex-wrap items-center gap-3 lg:gap-4 mt-3 lg:mt-4 text-xs lg:text-sm">
                  <span className="flex items-center gap-1"><Pill size={16} /> {medicine.dosage?.form || 'N/A'} - {medicine.dosage?.strength || 'N/A'}</span>
                  <span className="flex items-center gap-1"><Tag size={16} /> {medicine.category || 'N/A'}</span>
                </div>
                <p className="text-secondary-700 mt-3 lg:mt-4 text-sm lg:text-base">{medicine.description || 'No description available.'}</p>
              </div>
            </div>
          </div>

          {/* Pharmacy Info */}
          {pharmacy && (
            <div className="mt-6 lg:mt-8">
              <h2 className="text-xl lg:text-2xl font-bold text-secondary-800 mb-3 lg:mb-4">Available At</h2>
              <div className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-base lg:text-lg flex items-center gap-2"><Building size={20} /> {pharmacy.name}</h3>
                  <p className="text-xs lg:text-sm text-secondary-500 flex items-center gap-2 mt-1"><MapPin size={14} /> {pharmacy.address}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-lg lg:text-xl font-bold text-primary-600 flex items-center sm:justify-end gap-1"><IndianRupee size={20} />{medicine.price.toFixed(2)}</p>
                  <button className="mt-2 px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-md hover:bg-primary-700 disabled:bg-primary-300 w-full sm:w-auto" disabled={medicine.stock === 0}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Map */}
        <div className="lg:col-span-1">
          <div className="bg-white p-4 rounded-lg shadow-md lg:sticky lg:top-24">
            <h3 className="text-lg font-semibold mb-4">Pharmacy Locations</h3>
            <div className="h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden">
              <MapContainer center={mapCenter} zoom={12} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {hasLocation && (
                  <Marker position={[pharmacy.location.coordinates[1], pharmacy.location.coordinates[0]]}>
                  <Popup>
                    <b>{pharmacy.name}</b><br/>
                    Price: ₹{medicine.price.toFixed(2)}
                  </Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineDetailPage;

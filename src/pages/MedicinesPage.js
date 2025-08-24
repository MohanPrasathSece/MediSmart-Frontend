import React from 'react';
import { useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import MedicineCard from '../components/medicines/MedicineCard';
import Spinner from '../components/common/Spinner';
import { History } from 'lucide-react';

const fetchMyMedicines = async (api) => {
  const { data } = await api.get('/medicines/my-medicines');
  return data;
};

const MedicinesPage = () => {
  const { api } = useAuth();
  const navigate = useNavigate();

  // Removed ALL medicines browsing for patients. Only show user's history below.

  // Fetch user's medicine history (from orders)
  const { data: medicines, isLoading, isError, error } = useQuery(
    'myMedicines',
    () => fetchMyMedicines(api)
  );

  // Fetch recent orders to build a fallback "Recently Purchased" section
  const { data: ordersData } = useQuery(
    ['ordersForHistoryFallback'],
    async () => {
      const { data } = await api.get('/orders?limit=5');
      return data.orders || [];
    },
    { staleTime: 60_000 }
  );

  // If user has no history, fetch a small pool to recommend
  const { data: recommendPool = [], isLoading: recLoading } = useQuery(
    ['recommendedMedicines'],
    async () => {
      const { data } = await api.get('/medicines/search', { params: { limit: 50 } });
      return data?.medicines || [];
    },
    {
      staleTime: 60_000,
      enabled: !isLoading && !isError && (!medicines || medicines.length === 0)
    }
  );

  const mostRecentOrder = Array.isArray(ordersData) && ordersData.length > 0 ? ordersData[0] : null;
  const recentItems = mostRecentOrder?.items?.slice(0, 4) || [];

  return (
    <div className="container mx-auto py-8">
      {/* Patient view: Only show My Medicine History */}

      {/* My Medicine History */}
      <div className="mb-4 text-center">
        <h2 className="text-xl font-semibold text-secondary-900">My Medicine History</h2>
        <p className="text-secondary-600 mt-1 text-sm">A list of medicines you have purchased previously.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>
      ) : isError ? (
        <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">
          <p className="font-bold">Error loading your medicines</p>
          <p>{error.message}</p>
        </div>
      ) : !medicines || medicines.length === 0 ? (
        <div className="space-y-6">
          <div className="mx-auto max-w-xl rounded-2xl border border-secondary-200 bg-gradient-to-b from-white to-secondary-50 p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600">
              <History size={22} />
            </div>
            <h2 className="text-lg font-semibold text-secondary-900">No purchase history yet</h2>
            <p className="mt-1 text-sm text-secondary-600">Upload a prescription to get started, or review your orders.</p>
            <div className="mt-6 flex flex-col items-stretch gap-2 sm:flex-row sm:justify-center">
              <Link
                to="/upload-prescription"
                className="inline-flex items-center justify-center rounded-md bg-primary-600 px-5 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                Start a New Order
              </Link>
              <Link
                to="/orders"
                className="inline-flex items-center justify-center rounded-md border border-secondary-300 bg-white px-5 py-2 text-sm font-medium text-secondary-800 hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-secondary-300"
              >
                View My Orders
              </Link>
            </div>
          </div>

          {/* Recommended medicines for new patients */}
          <div className="bg-white rounded-lg shadow-md p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold">Explore medicines</h3>
              {/* optional: link to a discovery page in future */}
            </div>
            {recLoading ? (
              <div className="flex justify-center items-center h-32"><Spinner size="md" /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {([...recommendPool]
                  .sort(() => Math.random() - 0.5)
                  .slice(0, 8))
                  .map(m => (
                    <MedicineCard key={m._id} medicine={m} variant="compact" />
                  ))}
              </div>
            )}
          </div>

          {mostRecentOrder && recentItems.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold">Recently Purchased</h3>
                <Link to={`/orders/${mostRecentOrder._id}`} className="text-sm text-primary-600 hover:underline">
                  View order #{mostRecentOrder._id.substring(0,8)}
                </Link>
              </div>
              <ul className="divide-y divide-secondary-200">
                {recentItems.map((it, idx) => (
                  <li key={idx} className="py-2.5 flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="font-medium text-secondary-900 truncate">
                        {it?.medicine?.name || it?.name || 'Medicine'}
                      </p>
                      <p className="text-xs text-secondary-500">Qty: {it.quantity} • ₹{(it.finalPrice ?? it.price ?? 0).toFixed(2)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const id = (it?.medicine?._id || it.medicine);
                        if (id) navigate(`/order/now/${id}`);
                      }}
                      className="text-xs px-3 py-1.5 bg-primary-600 text-white rounded hover:bg-primary-700"
                    >
                      Order Again
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {medicines.map(medicine => (
            <MedicineCard key={medicine._id} medicine={medicine} variant="compact" />
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicinesPage;

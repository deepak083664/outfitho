import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Loader2, Filter, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ModernTable from '../../components/admin/ModernTable';
import api from '../../services/api';
import { X, Package, Truck, Calendar, MapPin, CreditCard, User } from 'lucide-react';

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                <Package size={20} />
             </div>
             <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-dark">Order Details</h2>
                <p className="text-xs font-bold text-gray-500">#{order._id.toUpperCase()}</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center">
                <User size={14} className="mr-2" /> Customer Info
              </h3>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="font-bold text-dark">{order.user?.name || 'Guest User'}</p>
                <p className="text-xs text-secondary font-medium">{order.user?.email || 'N/A'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center">
                <MapPin size={14} className="mr-2" /> Shipping Address
              </h3>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-xs font-medium leading-relaxed">
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center">
              <CreditCard size={14} className="mr-2" /> Order Items
            </h3>
            <div className="border border-gray-100 rounded-xl overflow-hidden">
               {order.orderItems.map((item, idx) => (
                 <div key={idx} className="flex items-center p-3 gap-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                   <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg" />
                   <div className="flex-grow">
                      <p className="text-xs font-black text-dark uppercase">{item.name}</p>
                      <p className="text-[10px] font-bold text-secondary uppercase mt-1">
                        Size: <span className="text-dark">{item.size}</span> | Qty: <span className="text-dark">{item.qty}</span>
                      </p>
                   </div>
                   <div className="text-xs font-black text-dark">
                      ₹{(item.price * item.qty).toLocaleString()}
                   </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
             <div>
                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-400 mb-1">Status</p>
                <span className={`text-[10px] font-black px-2 py-1 rounded-full border ${
                  order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                  order.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                }`}>
                  {order.status}
                </span>
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-400 mb-1">Date</p>
                <p className="text-xs font-bold text-dark uppercase">{new Date(order.createdAt).toLocaleDateString()}</p>
             </div>
             <div className="md:text-right">
                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-400 mb-1">Total Paid</p>
                <p className="text-lg font-black text-dark">₹{order.totalPrice.toLocaleString()}</p>
             </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Orders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumber = searchParams.get('pageNumber') || 1;

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/orders?pageNumber=${pageNumber}`);
      
      const formatted = res.data.orders.map(order => ({
        id: order._id,
        customer: order.user?.name || 'Guest User',
        email: order.user?.email || 'N/A',
        date: new Date(order.createdAt).toLocaleDateString(),
        total: order.totalPrice,
        status: order.status || (order.isDelivered ? 'Delivered' : 'Processing'),
        raw: order 
      }));
      
      setData(formatted);
      setPages(res.data.pages);
      setTotal(res.data.total);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [pageNumber]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/orders/${id}/status`, { status: newStatus });
      setData(prev => prev.map(order => 
        order.id === id ? { ...order, status: newStatus } : order
      ));
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

  const handleViewDetails = (orderRaw) => {
    setSelectedOrder(orderRaw);
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Processing': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const columns = useMemo(() => [
    { 
      header: 'Order ID', 
      accessor: 'id',
      render: (row) => <span className="font-mono text-sm font-semibold text-gray-900">#{row.id.substring(row.id.length - 8).toUpperCase()}</span>
    },
    { 
      header: 'Customer', 
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-900">{row.customer}</p>
          <p className="text-xs text-gray-500">{row.email}</p>
        </div>
      )
    },
    { header: 'Date', accessor: 'date' },
    { 
      header: 'Total', 
      accessor: 'total',
      render: (row) => <span className="font-semibold text-gray-900">₹{row.total.toLocaleString()}</span>
    },
    { 
      header: 'Status', 
      render: (row) => (
        <select
          value={row.status}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          className={`text-xs font-bold px-3 py-1.5 rounded-full border outline-none cursor-pointer ${getStatusColor(row.status)}`}
        >
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      )
    },
    { 
      header: '', 
      render: (row) => (
        <button 
          onClick={() => handleViewDetails(row.raw)}
          className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors ml-auto block"
          title="View Details"
        >
          <Eye size={18} />
        </button>
      )
    }
  ], []);

  const handlePageChange = (newPage) => {
    setSearchParams({ pageNumber: newPage });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col flex-wrap sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track {total} customer checkouts.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div className="text-sm text-gray-500 font-medium">
          Showing {data.length} orders of {total}
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="animate-spin text-black" size={40} />
          <p className="text-gray-500 font-medium animate-pulse">Retrieving order shipment data...</p>
        </div>
      ) : (
        <>
          <ModernTable columns={columns} data={data} emptyMessage="No orders found." />
          
          {pages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-8">
              <button 
                onClick={() => handlePageChange(Number(pageNumber) - 1)}
                disabled={Number(pageNumber) === 1}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              {[...Array(pages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-10 h-10 rounded-lg border font-bold text-sm transition-all ${
                    Number(pageNumber) === (i + 1) 
                    ? 'bg-black text-white border-black shadow-md scale-110' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                onClick={() => handlePageChange(Number(pageNumber) + 1)}
                disabled={Number(pageNumber) === pages}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}

      {showModal && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
};

export default React.memo(Orders);

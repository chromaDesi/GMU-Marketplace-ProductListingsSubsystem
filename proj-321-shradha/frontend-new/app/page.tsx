'use client';

import { useState, useEffect } from 'react';
import { productAPI, userAPI } from '@/lib/api';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string | number;
  category: string;
  condition: string;
  status: 'active' | 'draft' | 'sold';
  image: string;
  views?: number;
}

interface User {
  id: number;
  username: string;
  full_name: string;
  email: string;
  active_listings: number;
  total_sales: number;
  seller_rating: number;
}

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    price: '',
    category: 'textbooks',
    condition: 'good',
    status: 'active' as 'active' | 'draft' | 'sold',
    image: ''
  });

  // Fetch user profile and products on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch user profile (requires authentication)
      try {
        const userProfile = await userAPI.getProfile();
        setUser(userProfile);
        
        // Fetch user's products
        const userProducts = await productAPI.getMyProducts();
        setProducts(userProducts.results || userProducts || []);
      } catch (authError) {
        // If not authenticated, fetch all products
        console.log('Not authenticated, fetching all products');
        const allProducts = await productAPI.getProducts({ status: 'active' });
        setProducts(allProducts.results || allProducts || []);
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(products.map((_, index) => index));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectItem = (index: number) => {
    if (selectedItems.includes(index)) {
      setSelectedItems(selectedItems.filter(i => i !== index));
    } else {
      setSelectedItems([...selectedItems, index]);
    }
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        // Update existing product
        const updated = await productAPI.updateProduct(editingProduct.id, {
          name: formData.productName,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          condition: formData.condition,
          status: formData.status,
        });
        
        // Update in local state
        setProducts(products.map(p => p.id === editingProduct.id ? {
          ...p,
          name: updated.name,
          description: updated.description,
          price: updated.price,
          category: updated.category,
          condition: updated.condition,
          status: updated.status,
        } : p));
        
        alert('Product updated successfully!');
      } else {
        // Create new product
        const newProduct = await productAPI.createProduct({
          name: formData.productName,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          condition: formData.condition,
          status: formData.status,
        });
        
        // Add to local state
        setProducts([newProduct, ...products]);
        alert('Product created successfully!');
      }
      
      // Reset form and close modal
      setShowModal(false);
      setEditingProduct(null);
      setFormData({
        productName: '',
        description: '',
        price: '',
        category: 'textbooks',
        condition: 'good',
        status: 'active',
        image: ''
      });
      
      // Refresh data
      fetchData();
    } catch (error: any) {
      console.error('Error saving product:', error);
      alert(error.message || 'Failed to save product. Please make sure you are logged in.');
    }
  };

  const handleDeleteItem = async (product: Product) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }
    
    try {
      await productAPI.deleteProduct(product.id);
      setProducts(products.filter(p => p.id !== product.id));
      alert('Product deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting product:', error);
      alert(error.message || 'Failed to delete product');
    }
  };

  const handleEditItem = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      productName: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      condition: product.condition,
      status: product.status,
      image: product.image || ''
    });
    setShowModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/50 px-3 py-1 text-xs font-medium text-green-700 dark:text-green-300">
            Active
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700/50 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300">
            Draft
          </span>
        );
      case 'sold':
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/50 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
            Sold
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-white dark:bg-[#111111] font-sans">
      <header className="sticky top-0 z-10 flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200/80 dark:border-gray-700/80 px-6 py-3 bg-white/80 dark:bg-[#111111]/80 backdrop-blur-sm">
        <div className="flex items-center gap-4 text-gray-900 dark:text-white">
          <svg className="w-8 h-8 text-[#13ec5b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Marketplace</h2>
        </div>
        <div className="flex flex-1 justify-end gap-4 items-center">
          <label className="flex flex-col min-w-40 !h-10 max-w-64">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
              <div className="text-gray-500 dark:text-gray-400 flex border-none bg-gray-100 dark:bg-gray-800 items-center justify-center pl-3 rounded-l-lg border-r-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-0 border-none bg-gray-100 dark:bg-gray-800 focus:border-none h-full placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal" placeholder="Search" />
            </div>
          </label>
          <div className="flex gap-2">
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCKC9Rn1OzjM1TAreljf710u2HTc7lrkKuNCtUUb_5J5Ibnxu4kttx7Rcd6zhiWupcy5aNuX1HXXy3y19eeIHW9njBpIYJAvPoQeDUVg0GReaKCcno-TZA4J12d0tZ2xXUKuqmnToNW0CaHR9FjwadLI1I8r-9CnCO0sarQfD7KBUty95AGBpy23fxsgJkkF0tQPFsCTKbUWAIx5SXoBEScMVfrUHmfXgru8MnZUYpSA-6OIWeEnt_1agBAqH3zTMJYO29BHO90-Kw")'}}></div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 flex-shrink-0 p-4 border-r border-gray-200/80 dark:border-gray-700/80">
          <div className="flex h-full flex-col justify-between">
            <div className="flex flex-col gap-6">
              <div className="flex gap-3 items-center px-2">
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCJC9oQqImroLH7I9Sg-VIxTCg9fSsKF1TIodLpLKsMZCQR5b-aRfWZQTfFyq2BLm9n94df0XJe2BASfmBOTlghJ8sW1g9f29aK4g4ZSkWNPRcKF6aWbFZdb9ME78niiQNRuibtYeMX1FExE2uZanFA2ZMSzcd6PAfggW1ucGqY_S_Wde_Pq_eWFrpS6K80ds4wBA-o1_7NYr5BWgHscrtP681yJ2FqmIOZR24DG8bKRTL8gvZ9n8qBzObKOHzjjrPxzW4Ialg11Bw")'}}></div>
                <div className="flex flex-col">
                  <h1 className="text-gray-900 dark:text-white text-base font-medium leading-normal">
                    {user ? user.full_name : 'GMU Marketplace'}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal">
                    {user ? 'Seller Dashboard' : 'All Listings'}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <a className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white" href="/">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <p className="text-sm font-medium leading-normal">All Listings</p>
                </a>
                <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white" href="/profile">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p className="text-sm font-medium leading-normal">Profile</p>
                </a>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex w-full flex-col gap-2 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-900 dark:text-white text-sm font-medium leading-normal">Active Listings</p>
                  <p className="text-gray-900 dark:text-white tracking-light text-2xl font-bold leading-tight">
                    {user ? user.active_listings : products.filter(p => p.status === 'active').length}
                  </p>
                </div>
                <div className="flex w-full flex-col gap-2 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-900 dark:text-white text-sm font-medium leading-normal">Total Sales</p>
                  <p className="text-gray-900 dark:text-white tracking-light text-2xl font-bold leading-tight">
                    {user ? user.total_sales : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
        <main className="flex-1 p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <p className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">Your Product Listings</p>
              <button 
                onClick={() => setShowModal(true)}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-[#13ec5b] hover:bg-[#11d952] text-gray-900 text-sm font-bold leading-normal tracking-[0.015em] gap-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="truncate">Create New Listing</span>
              </button>
            </div>
            <div className="px-0 py-3">
              <div className="overflow-hidden rounded-lg border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-[#111111]">
                <table className="w-full text-left">
                  <thead className="bg-white dark:bg-[#111111]">
                    <tr className="border-b border-gray-200/80 dark:border-gray-700/80">
                      <th className="px-4 py-3 w-10 text-center">
                        <input 
                          className="h-4 w-4 rounded border-gray-400 dark:border-gray-500 bg-transparent text-[#13ec5b] checked:bg-[#13ec5b] checked:border-[#13ec5b] focus:ring-0 focus:ring-offset-0 cursor-pointer" 
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300 text-sm font-medium leading-normal min-w-[200px]">Product</th>
                      <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300 text-sm font-medium leading-normal">Price</th>
                      <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300 text-sm font-medium leading-normal">Condition</th>
                      <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300 text-sm font-medium leading-normal">Status</th>
                      <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300 text-sm font-medium leading-normal">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="h-[200px] text-center text-gray-500 dark:text-gray-400">
                          Loading products...
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan={6} className="h-[200px] text-center text-red-500">
                          {error}
                        </td>
                      </tr>
                    ) : products.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="h-[200px] text-center text-gray-500 dark:text-gray-400">
                          No products found. {user && 'Create your first listing!'}
                        </td>
                      </tr>
                    ) : (
                      products.map((product, index) => (
                        <tr key={product.id} className="border-t border-gray-200/80 dark:border-gray-700/80">
                          <td className="h-[72px] px-4 py-2 w-10 text-center">
                            <input 
                              className="h-4 w-4 rounded border-gray-400 dark:border-gray-500 bg-transparent text-[#13ec5b] checked:bg-[#13ec5b] checked:border-[#13ec5b] focus:ring-0 focus:ring-offset-0 cursor-pointer" 
                              type="checkbox"
                              checked={selectedItems.includes(index)}
                              onChange={() => handleSelectItem(index)}
                            />
                          </td>
                          <td className="h-[72px] px-4 py-2 text-gray-800 dark:text-gray-200 text-sm font-normal leading-normal">
                            <div className="flex items-center gap-4">
                              <div 
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg w-12 h-12 bg-gray-200 dark:bg-gray-700" 
                                style={{backgroundImage: product.image ? `url("${product.image}")` : undefined}}
                              >
                                {!product.image && (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <div>
                                <span className="font-medium block">{product.name}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{product.category}</span>
                              </div>
                            </div>
                          </td>
                          <td className="h-[72px] px-4 py-2 text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal">
                            ${typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price).toFixed(2)}
                          </td>
                          <td className="h-[72px] px-4 py-2 text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal capitalize">
                            {product.condition?.replace('_', ' ')}
                          </td>
                          <td className="h-[72px] px-4 py-2 text-sm font-normal leading-normal">
                            {getStatusBadge(product.status)}
                          </td>
                          <td className="h-[72px] px-4 py-2">
                            <div className="flex gap-2 text-gray-600 dark:text-gray-400">
                              <button 
                                onClick={() => handleEditItem(product)}
                                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                                title="Edit"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button 
                                onClick={() => alert(`Product: ${product.name}\nPrice: $${product.price}\nCategory: ${product.category}\nCondition: ${product.condition}\nViews: ${product.views || 0}`)}
                                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                                title="View"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              <button 
                                onClick={() => handleDeleteItem(product)}
                                className="p-1 rounded-md hover:bg-red-500/20 text-red-500"
                                title="Delete"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Create New Listing Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingProduct ? 'Edit Listing' : 'Create New Listing'}
              </h2>
              <button 
                onClick={() => {
                  setShowModal(false);
                  setEditingProduct(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateListing} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.productName}
                  onChange={(e) => setFormData({...formData, productName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#13ec5b] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#13ec5b] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Describe your product..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#13ec5b] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#13ec5b] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="textbooks">Textbooks</option>
                    <option value="electronics">Electronics</option>
                    <option value="furniture">Furniture</option>
                    <option value="clothing">Clothing</option>
                    <option value="supplies">Supplies</option>
                    <option value="sports">Sports & Outdoors</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Condition *
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({...formData, condition: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#13ec5b] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="new">New</option>
                    <option value="like_new">Like New</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="used">Used</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'draft' | 'sold'})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#13ec5b] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#13ec5b] hover:bg-[#11d952] text-gray-900 rounded-lg font-medium"
                >
                  {editingProduct ? 'Update Listing' : 'Create Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

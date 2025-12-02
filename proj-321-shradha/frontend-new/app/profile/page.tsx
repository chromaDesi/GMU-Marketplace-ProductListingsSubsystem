'use client';

import { useState, useEffect } from 'react';
import { userAPI, productAPI } from '@/lib/api';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  full_name: string;
  bio?: string;
  location?: string;
  phone?: string;
  active_listings: number;
  total_sales: number;
  seller_rating: number;
}

export default function SellerProfile() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  
  const [formData, setFormData] = useState({
    sellerName: '',
    location: '',
    email: '',
    contactMethod: 'In-app messages only',
    bio: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const profile = await userAPI.getProfile();
      setUser(profile);
      
      // Update form data with fetched profile
      setFormData({
        sellerName: profile.full_name || profile.username,
        location: profile.location || '',
        email: profile.email,
        contactMethod: 'In-app messages only',
        bio: profile.bio || ''
      });
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Failed to load profile');
      
      // Set default values if not authenticated
      setFormData({
        sellerName: 'Guest User',
        location: '',
        email: '',
        contactMethod: 'In-app messages only',
        bio: ''
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!user) {
      alert('Please log in to update your profile');
      return;
    }

    try {
      const updatedProfile = await userAPI.updateProfile({
        full_name: formData.sellerName,
        location: formData.location,
        email: formData.email,
        bio: formData.bio,
      });
      
      setUser(updatedProfile);
      alert('Profile updated successfully!');
    } catch (err: any) {
      console.error('Error updating profile:', err);
      alert(err.message || 'Failed to update profile');
    }
  };

  const handleChangePhoto = () => {
    alert('Photo upload functionality will be implemented soon!');
  };

  if (loading) {
    return (
      <div className="relative flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#1ce35e]"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-gray-50 text-gray-900 font-sans">
      {/* TopNavBar */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 px-6 sm:px-10 lg:px-20 py-3 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 text-[#1ce35e]">
            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fillRule="evenodd"></path>
            </svg>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Marketplace</h2>
        </div>
        <div className="hidden md:flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-9">
            <a className="text-sm font-medium leading-normal text-gray-900 hover:text-[#1ce35e] transition-colors" href="/">Dashboard</a>
            <a className="text-sm font-medium leading-normal text-gray-900 hover:text-[#1ce35e] transition-colors" href="/">My Listings</a>
            <a className="text-sm font-medium leading-normal text-gray-900 hover:text-[#1ce35e] transition-colors" href="#">Messages</a>
            <a className="text-sm font-medium leading-normal text-gray-900 hover:text-[#1ce35e] transition-colors" href="#">Orders</a>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#1ce35e] text-black text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#19c954] transition-colors">
              <span className="truncate">Create Listing</span>
            </button>
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-[#d4f4dd] text-gray-900 gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 hover:bg-[#c0eed0] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-[#d4f4dd] text-gray-900 gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 hover:bg-[#c0eed0] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBSjfaFnL5iHSTWIrDop8GoS6YuI-m728UO86KRMTqZN2xoy6k_R55LngfH8FIDwJHI1DuQ8zu1xdQ_qz2uGtgKp2dH9yL8dyaOMIMk30xr3Q7mMZGQWYpQt088HiusVTVHnilQIs4tTp1kbT8Na2aIj_csAL5lSb0g4i-bo5FH4bJWpRqMuXvzmw_NKeI8WD6sQgHtawpEUzB5XG37Ld66yxqDc9NJS0SIOoiB_VjsA4VmQzUVD7SgsXmWUCKVa5EVw1H3-xcdaMk")'}}></div>
        </div>
        <button className="md:hidden flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-[#d4f4dd] text-gray-900 gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <aside className="w-full lg:w-1/3 lg:max-w-xs flex flex-col gap-6">
            {/* Profile Picture Section */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center text-center shadow-sm">
              <div className="relative group mb-4">
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-32" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAIhVjo5Dv0MjaGGRJzSZDpddDUSgIoDq6P3oN7FsEbkRLc4FtMBjhQpFQKrj9SRgDY3fztishsIOafzmSz2oJ1WMqJHoGnMNwNs2FUAnzO6okgHKWvY1NcZ7wNON9QX0-OaqzStqCoGD_7p6m70mElYWCwoE6v7cA5Uw_vO1cmaRBJCXuOEI3-hcSSTk9Fbsr_ce6FuBcmAdT0ckExYOioLvIU_k8bWE0P05RT-Gy_uaqchoXOpC0vfNTS46H--1e9Aox2kCmC75A")'}}></div>
                <button 
                  onClick={handleChangePhoto}
                  className="absolute inset-0 size-32 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{formData.sellerName || 'Seller'}</h2>
              <p className="text-sm text-gray-600 mt-1">Seller Dashboard</p>
              <button 
                onClick={handleChangePhoto}
                className="w-full mt-4 flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#d4f4dd] text-gray-900 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#c0eed0] transition-colors"
              >
                <span className="truncate">Change Photo</span>
              </button>
              <p className="text-xs text-gray-500 mt-3">Recommended size: 200×200px</p>
            </div>

            {/* Seller Stats Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4 text-gray-900">Your Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-[#d4f4dd] p-3 rounded-lg">
                    <svg className="w-6 h-6 text-[#1ce35e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium text-gray-900">Active Listings</p>
                    <p className="text-2xl font-bold text-gray-900">{user?.active_listings || 0}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-[#d4f4dd] p-3 rounded-lg">
                    <svg className="w-6 h-6 text-[#1ce35e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium text-gray-900">Total Sales</p>
                    <p className="text-2xl font-bold text-gray-900">{user?.total_sales || 0}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-[#d4f4dd] p-3 rounded-lg">
                    <svg className="w-6 h-6 text-[#1ce35e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium text-gray-900">Seller Rating</p>
                    <div className="flex items-center gap-1">
                      <p className="text-2xl font-bold text-gray-900">
                        {user?.seller_rating ? Number(user.seller_rating).toFixed(1) : 'N/A'}
                      </p>
                      {user && <span className="text-sm text-gray-600">(reviews)</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Content Area */}
          <div className="w-full lg:w-2/3 flex-grow flex flex-col gap-6">
            {/* Page Heading */}
            <div className="flex flex-wrap justify-between items-center gap-3">
              <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-gray-900">Edit Your Seller Profile</h1>
              <div className="flex gap-2">
                <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-5 border border-gray-200 text-gray-900 text-sm font-bold leading-normal tracking-[0.015em] bg-white hover:bg-gray-50 transition-colors">
                  <span>View Public Profile</span>
                </button>
                <button 
                  onClick={handleSaveChanges}
                  className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-5 bg-[#1ce35e] text-black text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#19c954] transition-colors"
                >
                  <span>Save Changes</span>
                </button>
              </div>
            </div>

            {/* Personal Information Card */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="text-[22px] font-bold leading-tight tracking-[-0.015em] text-gray-900">Your Details</h2>
                <button className="flex items-center gap-2 text-sm font-bold text-[#1ce35e] hover:text-[#19c954] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-sm font-medium leading-normal pb-2 text-gray-600">Seller Name</label>
                  <input 
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 focus:outline-0 focus:ring-2 focus:ring-[#1ce35e]/50 border border-gray-200 bg-gray-50 h-12 placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal" 
                    type="text" 
                    value={formData.sellerName}
                    onChange={(e) => setFormData({...formData, sellerName: e.target.value})}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium leading-normal pb-2 text-gray-600">Public Location</label>
                  <input 
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 focus:outline-0 focus:ring-2 focus:ring-[#1ce35e]/50 border border-gray-200 bg-gray-50 h-12 placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal" 
                    type="text" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium leading-normal pb-2 text-gray-600">Email Address</label>
                  <input 
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 focus:outline-0 focus:ring-2 focus:ring-[#1ce35e]/50 border border-gray-200 bg-gray-50 h-12 placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal" 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  <p className="text-xs text-gray-500 mt-1.5">Your email is private and will not be shared.</p>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium leading-normal pb-2 text-gray-600">Contact Method</label>
                  <input 
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 focus:outline-0 focus:ring-2 focus:ring-[#1ce35e]/50 border border-gray-200 bg-gray-50 h-12 placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal opacity-60 cursor-not-allowed" 
                    disabled 
                    type="text" 
                    value={formData.contactMethod}
                  />
                </div>
              </div>
            </div>

            {/* About Me Card */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="text-[22px] font-bold leading-tight tracking-[-0.015em] text-gray-900">About You</h2>
                <button className="flex items-center gap-2 text-sm font-bold text-[#1ce35e] hover:text-[#19c954] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
              </div>
              <div className="p-6">
                <label className="text-sm font-medium leading-normal pb-2 text-gray-600 block">Bio / Business Description</label>
                <textarea 
                  className="form-textarea w-full min-h-[120px] resize-y overflow-hidden rounded-lg text-gray-900 focus:outline-0 focus:ring-2 focus:ring-[#1ce35e]/50 border border-gray-200 bg-gray-50 p-[15px] text-base font-normal leading-normal placeholder:text-gray-500" 
                  placeholder="Tell buyers a little about yourself or your business..."
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


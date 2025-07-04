'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const RCICVerificationPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    collegeId: '',
    companyName: '',
    country: '',
    city: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to consultant dashboard (dummy, no backend)
    router.push('/consultant-dashboard');
  };

  return (
    <div className="min-h-screen bg-[#7a2323] flex flex-col items-center justify-start py-12">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow p-8">
        <div className="flex flex-col items-center mb-6">
          <img src="/apple-abroads-logo.svg" alt="CICC Logo" className="h-16 mb-2" />
          <h1 className="text-3xl font-bold text-[#7a2323] mb-2">CICC</h1>
          <p className="text-sm text-gray-700 text-center mb-2">
            For more information on type of licence please visit{' '}
            <a href="https://college-ic.ca/protecting-the-public/find-an-immigration-consultant" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">this link</a>.
          </p>
        </div>
        <h2 className="text-xl font-semibold mb-4">Search for an RCIC</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name Contains</label>
            <input name="firstName" value={form.firstName} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name Contains</label>
            <input name="lastName" value={form.lastName} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">College ID Contains</label>
            <input name="collegeId" value={form.collegeId} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Company Name Contains</label>
            <input name="companyName" value={form.companyName} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Country</label>
            <input name="country" value={form.country} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input name="city" value={form.city} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="col-span-2 flex justify-start mt-4">
            <button type="submit" className="px-6 py-2 bg-[#7a2323] text-white rounded border border-[#7a2323] hover:bg-white hover:text-[#7a2323] transition">Find</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RCICVerificationPage; 
import React from 'react';

export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Skeleton for Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-3">
          <div className="h-8 w-64 bg-slate-200 rounded-lg dark:bg-slate-800"></div>
          <div className="h-4 w-48 bg-slate-100 rounded-md dark:bg-slate-900"></div>
        </div>
        <div className="h-10 w-32 bg-slate-100 rounded-xl dark:bg-slate-800"></div>
      </div>

      {/* Skeleton for Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-border flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
            <div className="space-y-2">
              <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="h-3 w-20 bg-slate-100 dark:bg-slate-800 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Skeleton for Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl h-80 border border-border p-8">
            <div className="h-6 w-32 bg-slate-100 dark:bg-slate-800 rounded mb-8"></div>
            <div className="w-full h-48 bg-slate-50 dark:bg-slate-800/50 rounded-2xl"></div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl h-80 border border-border p-8 flex flex-col items-center">
            <div className="h-6 w-full bg-slate-100 dark:bg-slate-800 rounded mb-10"></div>
            <div className="w-40 h-40 rounded-full border-8 border-slate-100 dark:border-slate-800"></div>
            <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded mt-8"></div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';

function AccountSkeleton() {
  return (
    <div
      role="status"
      className="animate-pulse space-y-4 divide-y divide-gray-200 border-b border-gray-200 p-4 shadow md:p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300"></div>
          <div className="h-2 w-32 rounded-full bg-gray-200"></div>
        </div>
        <div className="h-2.5 w-12 rounded-full bg-gray-300"></div>
      </div>

      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default AccountSkeleton;

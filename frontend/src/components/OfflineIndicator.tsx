import React from 'react';
import { WifiOff } from 'lucide-react';

function OfflineIndicator() {
  return (
    <div className="bg-yellow-500 text-white px-4 py-2 flex items-center justify-center">
      <WifiOff className="h-5 w-5 mr-2" />
      <span>You are currently offline. Some features may be limited.</span>
    </div>
  );
}

export default OfflineIndicator;
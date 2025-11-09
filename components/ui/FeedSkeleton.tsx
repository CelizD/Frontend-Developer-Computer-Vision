import React from 'react';

const FeedSkeleton = ({ isMainFeed }: { isMainFeed: boolean }) => {
  const heightClass = isMainFeed ? 'h-60' : 'h-40';
  
  return (
    <div className={`w-full ${heightClass} bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse flex items-center justify-center`}>
      <div className="w-10 h-10 border-4 border-t-4 border-gray-400 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default FeedSkeleton;
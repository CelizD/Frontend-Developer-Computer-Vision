import React from 'react';
import { RoomMetric } from '../../types/global.d';

type Props = {
  metric?: RoomMetric;
  isMainFeed?: boolean;
  viewMode?: 'video' | 'heatmap';
};

const CameraFeed: React.FC<Props> = ({ metric, isMainFeed = false, viewMode = 'video' }) => {
  if (!metric) return <div className="text-sm text-gray-500">No camera</div>;
  return (
    <div className={`w-full h-40 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center ${isMainFeed ? 'h-56' : ''}`}>
      <div className="text-center text-sm text-gray-600 dark:text-gray-300">
        <div className="font-medium">{metric.room}</div>
        <div className="text-xs">{metric.occupied}/{metric.total} occupied</div>
        <div className="mt-2 text-xs">{viewMode === 'video' ? 'Live video (stub)' : 'Heatmap (stub)'}</div>
      </div>
    </div>
  );
};

export default CameraFeed;

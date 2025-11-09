import React from 'react';

type Props = {
  // RoomMetric.status may be Spanish or English; allow both common values
  status?: 'Online' | 'Offline' | 'Alert' | 'LowLight' | 'Luz Baja' | string;
};

const CameraStatusIcon: React.FC<Props> = ({ status = 'Online' }) => {
  const map: Record<string, string> = {
    Online: '🟢',
    Offline: '⚫',
    Alert: '🔴',
    LowLight: '🟡',
    'Luz Baja': '🟡',
  };
  return <span aria-label="camera-status">{map[status] ?? '⚪'}</span>;
};

export default CameraStatusIcon;

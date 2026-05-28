import { useState } from 'react';
import { DASHBOARD_PLATFORMS } from '../data/dashboardPlatforms';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardMain from '../components/dashboard/DashboardMain';
import DashboardRightPanel from '../components/dashboard/DashboardRightPanel';
import DashboardBottom from '../components/dashboard/DashboardBottom';

export default function Dashboard() {
  const [selectedPlatformId, setSelectedPlatformId] = useState('government_rd');

  const selectedPlatform =
    DASHBOARD_PLATFORMS.find(p => p.platform_id === selectedPlatformId) ??
    DASHBOARD_PLATFORMS[0];

  return (
    <div className="flex flex-col gap-4">
      {/* 3패널 행: 사이드바 | 메인 | 우측 패널 */}
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        <DashboardSidebar
          platforms={DASHBOARD_PLATFORMS}
          selectedId={selectedPlatformId}
          onSelect={setSelectedPlatformId}
        />
        <DashboardMain platform={selectedPlatform} />
        <DashboardRightPanel />
      </div>

      {/* 하단 패널: 진행 문서 | 알림 | 사용 이력 */}
      <DashboardBottom />
    </div>
  );
}

// page.tsx

import React, { useState } from "react";
import { AdminLayout } from "./layout";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("category-channels");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <AdminLayout activeTab={activeTab} onTabChange={handleTabChange}>
      {activeTab === "category-channels" ? (
        <div>
          {/* Category Channels content goes here */}
          <h3 className="text-gray-700 text-3xl font-medium mb-6">
            카테고리 채널 목록
          </h3>
          {/* 다른 채널 목록 컴포넌트와 내용 추가 */}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-10">
          <h3 className="text-2xl font-semibold mb-4">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} 페이지
          </h3>
          <p>이 페이지는 아직 구현되지 않았습니다.</p>
        </div>
      )}
    </AdminLayout>
  );
}

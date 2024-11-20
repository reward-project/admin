"use client";

import React, { useEffect, useRef, useState } from "react";
import { Users, List } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// 사용자 정의 RSocket 클라이언트 설정 모듈 임포트
import { RSocketClientSetup } from "@/hooks/useRSocketConnection";
import useUserStore from "@/store/useUserStore";

interface UserCounts {
  authenticatedUserCount: number;
  anonymousUserCount: number;
}

export function AdminDashboardComponent() {
const userInfo = useUserStore((state) => state.userInfo);
const token = useUserStore((state) => state.userInfo?.token);
const hasHydrated = useUserStore((state) => state.hasHydrated);

  const [userCounts, setUserCounts] = useState<UserCounts>({
    authenticatedUserCount: 0,
    anonymousUserCount: 0,
  });

  const clientRef = useRef<any>(null);

  useEffect(() => {
    // 스트림 설정
    // if (userInfo ) {
      const selectedStreams = [
        {
          endpoint: `api.v1.status.user-counts`,
          onNext: (data: any) => {
            // 데이터 수신 시 상태 업데이트
            setUserCounts(data);
          },
        },
      ];

      // RSocket 클라이언트 초기화
      RSocketClientSetup.init({
        clientRef,
        token,
        channels: [],
        streams: selectedStreams,
      });
    // }

    return () => {
      // 컴포넌트 언마운트 시 연결 해제
      clientRef.current?.close();
    };
  }, []);

  return (
    <div className="container mx-auto px-6 py-8">
      <h3 className="text-gray-700 text-3xl font-medium">Dashboard</h3>

      <div className="mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 총 사용자 수 */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userCounts.authenticatedUserCount +
                  userCounts.anonymousUserCount}
              </div>
              <p className="text-xs text-muted-foreground">
                {/* 추가 정보가 필요하다면 여기에 표시 */}
              </p>
            </CardContent>
          </Card>
          {/* 인증된 사용자 수 */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Authenticated Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userCounts.authenticatedUserCount}
              </div>
              <p className="text-xs text-muted-foreground">
                {/* 추가 정보가 필요하다면 여기에 표시 */}
              </p>
            </CardContent>
          </Card>
          {/* 익명 사용자 수 */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Anonymous Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userCounts.anonymousUserCount}
              </div>
              <p className="text-xs text-muted-foreground">
                {/* 추가 정보가 필요하다면 여기에 표시 */}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        {/* iframe 추가 */}
        <iframe
          src="https://monitor.master-of-prediction.shop/d-solo/ce4hto5h2cykgd/activeuser?from=1732066584644&to=1732088184644&timezone=browser&orgId=1&panelId=1&__feature.dashboardSceneSolo"
          width="450"
          height="200"
          frameBorder="0"
        />
      </div>
    </div>
  );
}

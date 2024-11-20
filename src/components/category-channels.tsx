// CategoryChannelsComponent.tsx

"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Layers,
  User,
  FileText,
  Users,
  CheckCircle,
  XCircle,
} from "lucide-react";
import apiClient from "@/handler/fetch/axios";

interface CategoryChannel {
  id: number;
  displayName: string;
  ownerUserId: number;
  imageUrl: string | null;
  bannerImg: string | null;
  description: string;
  communityRule: { communityRule: string };
  categoryChannelUserCounts: { joinCount: number };
  categoryChannelStatus: string;
}
import Image from "next/image"
export function CategoryChannelsComponent() {
  const [channels, setChannels] = useState<CategoryChannel[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchChannels(currentPage);
  }, [currentPage]);

  const fetchChannels = async (page: number) => {
    try {
      const response = await apiClient.get(
        `/category-channels/all?page=${page}&size=10`
      );
      console.log(response.data.content);
      setChannels(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching category channels:", error);
    }
  };

  const changeChannelStatus = async (
    channelId: number,
    status: "APPROVED" | "REJECTED"
  ) => {
    try {
      await apiClient.post(
        `/admin/category-channels/${channelId}/status?status=${status}`
      );
      setChannels((prevChannels) =>
        prevChannels.map((channel) =>
          channel.id === channelId
            ? { ...channel, categoryChannelStatus: status }
            : channel
        )
      );
      setMessage(
        `${channelId}번 채널이 ${
          status === "APPROVED" ? "승인" : "거절"
        }되었습니다.`
      );
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error changing channel status:", error);
    }
  };

  const handleApprove = (channelId: number) => {
    if (window.confirm(`${channelId}번 채널을 승인하시겠습니까?`)) {
      changeChannelStatus(channelId, "APPROVED");
    }
  };

  const handleReject = (channelId: number) => {
    if (window.confirm(`${channelId}번 채널을 거절하시겠습니까?`)) {
      changeChannelStatus(channelId, "REJECTED");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">카테고리 채널 목록</h1>
      {message && (
        <div
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4"
          role="alert"
        >
          <p>{message}</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {channels.map((channel) => (
          <Card key={channel.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg font-bold">
                {channel.displayName}
              </CardTitle>
              <CardDescription>채널 ID: {channel.id}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <User className="mr-2 text-gray-500" size={16} />
                  <span className="text-sm">
                    개설자 ID: {channel.ownerUserId}
                  </span>
                </div>
                <div className="flex items-center">
                  {channel.imageUrl ? (
                    <Image
                      width={500}
                      height={500}
                      src={channel.imageUrl}
                      alt={`${channel.imageUrl} 이미지`}
                      className="w-16 h-16 mr-2 rounded-md"
                    />
                  ) : (
                    <span className="text-sm text-gray-500">이미지 없음</span>
                  )}
                </div>
                <div className="flex items-center">
                  {channel.bannerImg ? (
                    <Image
                      width={500}
                      height={500}
                      src={channel.bannerImg}
                      alt={`${channel.bannerImg} 배너`}
                      className="w-full h-20 object-cover rounded-md"
                    />
                  ) : (
                    <span className="text-sm text-gray-500">배너 없음</span>
                  )}
                </div>
                <div className="flex items-start">
                  <FileText className="mr-2 text-gray-500 mt-1" size={16} />
                  <span className="text-sm">{channel.description}</span>
                </div>
                <div className="flex items-start">
                  <FileText className="mr-2 text-gray-500 mt-1" size={16} />
                  <span className="text-sm">
                    규칙: {channel.communityRule.communityRule}
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 text-gray-500" size={16} />
                  <span className="text-sm">
                    사용자 수: {channel.categoryChannelUserCounts.joinCount}
                  </span>
                </div>
                <div className="flex items-center">
                  <Layers className="mr-2 text-gray-500" size={16} />
                  <span className="text-sm">
                    상태: {channel.categoryChannelStatus}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {channel.categoryChannelStatus === "APPLY" ? (
                <div className="flex w-full space-x-2">
                  <Button
                    onClick={() => handleApprove(channel.id)}
                    className="w-1/2"
                  >
                    <CheckCircle className="mr-2" size={16} />
                    승인
                  </Button>
                  <Button
                    onClick={() => handleReject(channel.id)}
                    className="w-1/2"
                    variant="destructive"
                  >
                    <XCircle className="mr-2" size={16} />
                    거절
                  </Button>
                </div>
              ) : (
                <Button disabled className="w-full">
                  {channel.categoryChannelStatus === "APPROVED"
                    ? "승인됨"
                    : "거절됨"}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 space-x-4">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
        >
          이전
        </Button>
        <span className="text-sm">
          페이지 {currentPage + 1} / {totalPages}
        </span>
        <Button
          onClick={() =>
            setCurrentPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev))
          }
          disabled={currentPage + 1 === totalPages}
        >
          다음
        </Button>
      </div>
    </div>
  );
}

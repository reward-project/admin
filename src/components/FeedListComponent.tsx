// FeedListComponent.tsx

"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
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
  Eye,
  Heart,
  MessageSquare,
  Share2,
  User,
  Calendar,
  Globe,
} from "lucide-react";

interface FeedsResponseDTO {
  id: number;
  authorType: string;
  title: string;
  content: string;
  createdAt: string;
  shortAt: string;
  updatedAt: string;
  viewCount: number;
  user: { userName: string };
  guest: { guestName: string } | null;
  isLike: boolean;
  mediaFileUrls: string[];
  youtubeUrls: string[];
  likesCount: number;
  commentsCount: number;
  shareCount: number;
  isShare: boolean;
  isQuote: boolean;
  quoteFeed: { title: string; content: string } | null;
}

export function FeedListComponent() {
  const [feeds, setFeeds] = useState<FeedsResponseDTO[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchFeeds(currentPage);
  }, [currentPage]);

  const fetchFeeds = async (page: number) => {
    try {
      const response = await axios.get(
        `/api/v1/feeds/home?page=${page}&size=10`
      );
      setFeeds(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching feeds:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">피드 목록</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feeds.map((feed) => (
          <Card key={feed.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg font-bold">{feed.title}</CardTitle>
              <CardDescription>
                작성자: {feed.user?.userName || feed.guest?.guestName || "익명"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">{feed.content}</p>
                {feed.mediaFileUrls.length > 0 && (
                  <div>
                    <p className="text-sm font-bold">미디어 파일:</p>
                    <ul className="list-disc list-inside">
                      {feed.mediaFileUrls.map((url, index) => (
                        <li key={index}>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {feed.youtubeUrls.length > 0 && (
                  <div>
                    <p className="text-sm font-bold">YouTube URLs:</p>
                    <ul className="list-disc list-inside">
                      {feed.youtubeUrls.map((url, index) => (
                        <li key={index}>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {feed.isQuote && feed.quoteFeed && (
                  <div className="p-2 border rounded-md bg-gray-50">
                    <p className="text-sm font-semibold">인용된 피드:</p>
                    <p className="text-sm">{feed.quoteFeed.title}</p>
                    <p className="text-xs text-gray-500">
                      {feed.quoteFeed.content}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-gray-500" />
                <span className="text-xs">{feed.viewCount}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="text-xs">{feed.likesCount}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-gray-500" />
                <span className="text-xs">{feed.commentsCount}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Share2 className="h-4 w-4 text-blue-500" />
                <span className="text-xs">{feed.shareCount}</span>
              </div>
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

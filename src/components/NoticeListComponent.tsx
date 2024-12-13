"use client";

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import apiClient from '@/handler/fetch/axios';
import { format } from 'date-fns';
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

interface Notice {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  isVisible: boolean;
}

export function NoticeListComponent() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotices = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/notices', {
        params: {
          search,
          page,
          size: 10,
          sort: 'createdAt,desc'
        }
      });

      if (response.data.success) {
        const { content, totalPages } = response.data.data;
        setNotices(content);
        setTotalPages(totalPages);
      }
    } catch (error: any) {
      console.error('Failed to fetch notices:', error);
      toast({
        title: "에러 발생",
        description: error.response?.data?.message || "공지사항 목록을 불러오는데 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [page, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchNotices();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">공지사항 관리</h1>
        <div className="flex gap-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="제목으로 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64"
            />
            <Button type="submit" disabled={isLoading}>
              <Search className="h-4 w-4 mr-2" />
              검색
            </Button>
          </form>
          <Button onClick={() => {/* TODO: 공지사항 작성 페이지로 이동 */}}>
            <Plus className="h-4 w-4 mr-2" />
            새 공지사항
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>제목</TableHead>
              <TableHead>작성자</TableHead>
              <TableHead>작성일</TableHead>
              <TableHead>수정일</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notices.map((notice) => (
              <TableRow key={notice.id}>
                <TableCell>{notice.id}</TableCell>
                <TableCell>{notice.title}</TableCell>
                <TableCell>{notice.author}</TableCell>
                <TableCell>
                  {format(new Date(notice.createdAt), 'yyyy-MM-dd HH:mm')}
                </TableCell>
                <TableCell>
                  {format(new Date(notice.updatedAt), 'yyyy-MM-dd HH:mm')}
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      notice.isVisible ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    )}
                  >
                    {notice.isVisible ? "공개" : "비공개"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {/* TODO: 수정 페이지로 이동 */}}
                    >
                      수정
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => {/* TODO: 삭제 기능 구현 */}}
                    >
                      삭제
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        <Button
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0 || isLoading}
        >
          이전
        </Button>
        <Button
          onClick={() => setPage(p => p + 1)}
          disabled={page >= totalPages - 1 || isLoading}
        >
          다음
        </Button>
      </div>
    </div>
  );
} 
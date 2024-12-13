// UserListComponent.tsx

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
import { Search } from "lucide-react";
import apiClient from '@/handler/fetch/axios';
import { format } from 'date-fns';
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

interface User {
  id: number;
  email: string;
  name: string;
  nickname: string;
  roles: string[];
  createdAt: string;
}

export function UserListComponent() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/members', {
        params: {
          search,
          page,
          size: 10,
          sort: 'createdAt,desc'
        }
      });

      if (response.data.success) {
        const { content, totalPages } = response.data.data;
        setUsers(content);
        setTotalPages(totalPages);
      }
    } catch (error: any) {
      console.error('Failed to fetch users:', error);
      toast({
        title: "에러 발생",
        description: error.response?.data?.message || "사용자 목록을 불러오는데 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchUsers();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">사용자 관리</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="이메일 또는 이름으로 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Button type="submit" disabled={isLoading}>
            <Search className="h-4 w-4 mr-2" />
            검색
          </Button>
        </form>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>이름</TableHead>
              <TableHead>닉네임</TableHead>
              <TableHead>권한</TableHead>
              <TableHead>가입일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.nickname}</TableCell>
                <TableCell>
                  {user.roles.map(role => (
                    <span
                      key={role}
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        role === "ROLE_ADMIN" && "bg-red-100 text-red-800",
                        role === "ROLE_USER" && "bg-blue-100 text-blue-800",
                        role === "ROLE_BUSINESS" && "bg-green-100 text-green-800"
                      )}
                    >
                      {role.replace('ROLE_', '')}
                    </span>
                  ))}
                </TableCell>
                <TableCell>
                  {format(new Date(user.createdAt), 'yyyy-MM-dd HH:mm')}
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

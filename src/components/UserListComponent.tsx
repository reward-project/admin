// UserListComponent.tsx

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
import { User, Mail, Calendar, MapPin, Shield, Image } from "lucide-react";
import apiClient from "@/handler/fetch/axios";

interface UserInfo {
  id: number;
  email: string;
  displayName: string;
  userName: string;
  age: number;
  gender: string;
  location: string;
  authority: string;
  token: string;
  birthday: string;
  avatarUrl: string | null;
  isWithdrawal: boolean;
}

export function UserListComponent() {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const fetchUsers = async (page: number) => {
    try {
      const response = await apiClient.get(`/users?page=${page}&size=20`);
      setUsers(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">사용자 목록</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg font-bold">
                {user.displayName}
              </CardTitle>
              <CardDescription>사용자 ID: {user.id}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <User className="mr-2 text-gray-500" size={16} />
                  <span className="text-sm">유저네임: {user.userName}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="mr-2 text-gray-500" size={16} />
                  <span className="text-sm">이메일: {user.email}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2 text-gray-500" size={16} />
                  <span className="text-sm">생년월일: {user.birthday}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 text-gray-500" size={16} />
                  <span className="text-sm">위치: {user.location}</span>
                </div>
                <div className="flex items-center">
                  <Shield className="mr-2 text-gray-500" size={16} />
                  <span className="text-sm">권한: {user.authority}</span>
                </div>
                <div className="flex items-center">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={`${user.displayName} 아바타`}
                      className="w-16 h-16 mr-2 rounded-md"
                    />
                  ) : (
                    <Image className="mr-2 text-gray-500" size={16} />
                  )}
                  <span className="text-sm">
                    아바타: {user.avatarUrl ? "있음" : "없음"}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm">
                    계정 상태: {user.isWithdrawal ? "탈퇴됨" : "활성"}
                  </span>
                </div>
              </div>
            </CardContent>
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

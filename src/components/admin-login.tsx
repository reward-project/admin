// AdminLoginComponent.tsx

"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import useUserStore from "@/store/useUserStore";
import apiClient from "@/handler/fetch/axios";
export function AdminLoginComponent() {
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Zustand 상태 관리
  const setUserInfo = useUserStore((state) => state.setUserInfo);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // 로그인 요청
      const response = await apiClient.post("/auth/login", {
        email,
        password,
      });

      // 액세스 토큰 가져오기
      const accessToken = response.data.token;
      console.log("Login successful:", accessToken);

      // Zustand 스토어에 사용자 정보 저장
      setUserInfo(response.data);

      // 로그인 성공 시 홈으로 리다이렉트
      router.push("/dashboard");
    } catch (error) {
      setError("잘못된 사용자 이름 또는 비밀번호입니다.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            관리자 로그인
          </CardTitle>
          <CardDescription className="text-center">
            관리자 계정으로 로그인하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">사용자 이름</Label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    size={18}
                  />
                  <Input
                    id="username"
                    placeholder="사용자 이름을 입력하세요"
                    value={email}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    size={18}
                  />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    aria-label={
                      showPassword ? "비밀번호 숨기기" : "비밀번호 보이기"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <Button type="submit" className="w-full mt-6">
              로그인
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full text-gray-600">
            기술적인 문제가 있나요?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              지원팀에 문의하세요
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

// AdminLoginComponent.tsx

"use client";

import { useState, useEffect } from "react";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { setUserInfo, userInfo, hasHydrated } = useUserStore();

  // 이미 로그인된 상태라면 대시보드로 리다이렉트
  useEffect(() => {
    if (hasHydrated && userInfo?.token) {
      router.replace('/dashboard');
    }
  }, [hasHydrated, userInfo, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await apiClient.post("/members/login", {
        email,
        password,
        role: "admin"
      });

      if (response.data.success && response.data.data) {
        const { accessToken, refreshToken } = response.data.data;
        
        // Zustand 스토어에 사용자 정보 저장
        setUserInfo({
          token: accessToken,
          refreshToken: refreshToken,
          email: email,
          // 필요한 다른 사용자 정보도 저장
        });

        router.push("/dashboard");
      } else {
        setError(response.data.message || "로그인에 실패했습니다.");
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // hydration이 완료되지 않았다면 로딩 상태를 보여줌
  if (!hasHydrated) {
    return <div>Loading...</div>;
  }

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
                <Label htmlFor="email">이메일</Label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    size={18}
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder="이메일을 입력하세요"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <Button 
              type="submit" 
              className="w-full mt-6"
              disabled={isLoading}
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full text-gray-600">
            기술적인 문제가 있나요?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              지원���에 문의하세요
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

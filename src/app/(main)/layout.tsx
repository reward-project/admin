// layout.tsx

"use client";

import React, { useEffect, useState } from "react";
import {
  Bell,
  Layout,
  List,
  Settings,
  Users,
  Layers,
  MoreVertical,
  LogOut,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useUserStore from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import { Menu } from "@headlessui/react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { userInfo, clearUserInfo, hasHydrated } = useUserStore((state) => state);
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (hasHydrated && !userInfo) {
      // hasHydrated가 true이고 userInfo가 없는 경우에만 동작
      router.push("/login");
    }
  }, [userInfo, router, hasHydrated]);

  const handleLogout = () => {
    clearUserInfo();
    router.push("/login"); // 로그아웃 후 로그인 페이지로 리다이렉트
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static w-[240px] bg-white shadow-md h-full z-30
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-4 flex justify-between items-center">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-800">관리자 패널</h1>
          <button
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-4">
          <Link
            href="/dashboard"
            className="block py-2 px-4 text-gray-700 hover:bg-gray-200 flex items-center"
            onClick={() => setIsSidebarOpen(false)}
          >
            <Layout className="mr-2" size={20} />
            <span className="text-sm lg:text-base">대시보드</span>
          </Link>
          <Link
            href="/users"
            className="block py-2 px-4 text-gray-700 hover:bg-gray-200 flex items-center"
            onClick={() => setIsSidebarOpen(false)}
          >
            <Users className="mr-2" size={20} />
            사용자 관리
          </Link>
          <Link
            href="/feeds"
            className="block py-2 px-4 text-gray-700 hover:bg-gray-200 flex items-center"
            onClick={() => setIsSidebarOpen(false)}
          >
            <List className="mr-2" size={20} />
            피드 관리
          </Link>
          <Link
            href="/settings"
            className="block py-2 px-4 text-gray-700 hover:bg-gray-200 flex items-center"
            onClick={() => setIsSidebarOpen(false)}
          >
            <Settings className="mr-2" size={20} />
            설정
          </Link>
          <Link
            href="/category-channels"
            className="block py-2 px-4 text-gray-700 hover:bg-gray-200 flex items-center"
            onClick={() => setIsSidebarOpen(false)}
          >
            <Layers className="mr-2" size={20} />
            카테고리 채널
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-2 lg:py-4 px-4 flex justify-between items-center">
            <div className="flex items-center">
              <button
                className="lg:hidden mr-4"
                onClick={() => setIsSidebarOpen(true)}
              >
                <MenuIcon className="h-6 w-6" />
              </button>
              <h2 className="font-semibold text-lg lg:text-xl text-gray-800">대시보드</h2>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Bell className="h-5 w-5" />
                <span className="sr-only">알림</span>
              </Button>
              
              <div className="relative">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 lg:h-10 lg:w-10">
                    <AvatarImage
                      src={userInfo?.avatarUrl || "https://via.placeholder.com/150"}
                      alt={userInfo?.displayName || "사용자 아바타"}
                    />
                    <AvatarFallback>
                      {userInfo?.displayName ? userInfo.displayName[0] : "U"}
                    </AvatarFallback>
                  </Avatar>
                  
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    <span className="text-sm font-medium text-gray-700 mr-2">
                      {userInfo?.displayName || "사용자"}
                    </span>
                  </Button>

                  <Menu as="div" className="relative">
                    <Menu.Button as={Button} variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Menu.Button>
                    <Menu.Items className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`${
                              active ? "bg-gray-100" : ""
                            } w-full px-4 py-2 text-sm text-gray-700 flex items-center`}
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            로그아웃
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Menu>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-4 lg:px-6 py-4 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

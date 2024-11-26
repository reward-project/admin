// layout.tsx

"use client";

import React, { useEffect } from "react";
import {
  Bell,
  Layout,
  List,
  Settings,
  Users,
  Layers,
  MoreVertical,
  LogOut,
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
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
        </div>
        <nav className="mt-4">
          <Link
            href="/dashboard"
            className="block py-2 px-4 text-gray-700 hover:bg-gray-200 flex items-center"
          >
            <Layout className="mr-2" size={20} />
            Dashboard
          </Link>
          <Link
            href="/users"
            className="block py-2 px-4 text-gray-700 hover:bg-gray-200 flex items-center"
          >
            <Users className="mr-2" size={20} />
            Users
          </Link>
          <Link
            href="/feeds"
            className="block py-2 px-4 text-gray-700 hover:bg-gray-200 flex items-center"
          >
            <List className="mr-2" size={20} />
            Feeds
          </Link>
          <Link
            href="/settings"
            className="block py-2 px-4 text-gray-700 hover:bg-gray-200 flex items-center"
          >
            <Settings className="mr-2" size={20} />
            Settings
          </Link>
          <Link
            href="/category-channels"
            className="block py-2 px-4 text-gray-700 hover:bg-gray-200 flex items-center"
          >
            <Layers className="mr-2" size={20} />
            Category Channels
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h2 className="font-semibold text-xl text-gray-800">Dashboard</h2>
            <div className="flex items-center">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <Avatar>
                    <AvatarImage
                      src={
                        userInfo?.avatarUrl || "https://via.placeholder.com/150"
                      }
                      alt={userInfo?.displayName || "User Avatar"}
                    />
                    <AvatarFallback>
                      {userInfo?.displayName ? userInfo.displayName[0] : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="ghost" size="sm">
                    <span className="text-sm font-medium text-gray-700 mr-2">
                      {userInfo?.displayName || "John Doe"}
                    </span>
                  </Button>

                  {/* Dropdown 메뉴 */}
                  <Menu as="div" className="relative">
                    <Menu.Button as={Button} variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Menu.Button>
                    <Menu.Items className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none">
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
          <div className="container mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

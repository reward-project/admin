"use client";
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import apiClient from '@/handler/fetch/axios';

export interface UserInfo {
  id?: string;
  email?: string;
  displayName?: string;
  authority?: string;
  token?: string;
  refreshToken?: string;
}

interface UserStore {
  userInfo: UserInfo | null;
  setUserInfo: (info: UserInfo) => void;
  clearUserInfo: () => void;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  refreshToken: () => Promise<boolean>;
}

const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set, get) => ({
        userInfo: null,
        hasHydrated: false,
        setUserInfo: (info) => {
          if (!info.token || !info.refreshToken) {
            console.error("Token and refresh token are required");
            return;
          }
          set({ userInfo: info });
        },
        clearUserInfo: () => {
          set({ userInfo: null });
          localStorage.removeItem("user-storage");

          // accessToken 쿠키 제거
          document.cookie = document.cookie =
            "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=master-of-prediction.shop;";
        },
        setHasHydrated: (state: boolean) => {
          set({ hasHydrated: state });
        },
        refreshToken: async () => {
          const currentUser = get().userInfo;
          if (!currentUser?.refreshToken) return false;

          try {
            const response = await apiClient.post('/members/refresh', {
              refreshToken: currentUser.refreshToken
            });

            if (response.data.success && response.data.data) {
              set({
                userInfo: {
                  ...currentUser,
                  token: response.data.data.accessToken,
                  refreshToken: response.data.data.refreshToken,
                }
              });
              return true;
            }
            return false;
          } catch (error) {
            console.error('Token refresh failed:', error);
            get().clearUserInfo();
            return false;
          }
        }
      }),
      {
        name: "user-storage",
        partialize: (state) => ({ userInfo: state.userInfo }),
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      }
    )
  )
);

export default useUserStore;

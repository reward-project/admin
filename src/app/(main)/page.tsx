// /login/page.tsx
"use client"
import { CategoryChannelsComponent } from "@/components/category-channels";
import useUserStore from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function AdminLoginPage() {
      const { userInfo,  hasHydrated } = useUserStore(
        (state) => state
      );
      const router = useRouter();
      useEffect(() => {
        if (hasHydrated && userInfo) {
          // hasHydrated가 true이고 userInfo가 없는 경우에만 동작
          router.push("/dashboard");
        }
      }, [userInfo, router, hasHydrated]);
   
  return <></>;
}
